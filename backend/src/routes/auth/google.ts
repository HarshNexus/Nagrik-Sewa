import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';

const router = Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

// Google OAuth authentication
router.post('/google', async (req, res) => {
  try {
    const { credential, mode } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }

    const { email, given_name, family_name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    let user = await User.findOne({ email });

    if (mode === 'register') {
      // Registration mode
      if (user) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      user = new User({
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email,
        password: '', // No password for Google OAuth users
        avatar: picture,
        isEmailVerified: true, // Google email is already verified
        role: 'customer',
        isGoogleAuth: true,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        }
      });

      await user.save();

      console.log('✅ New Google user registered:', user.email);

    } else {
      // Login mode
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'No account found with this email. Please register first.'
        });
      }

      // Update user avatar if changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }

      console.log('✅ Google user logged in:', user.email);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: `Successfully ${mode === 'register' ? 'registered' : 'logged in'} with Google`,
      data: {
        user: userResponse,
        token,
        tokens: {
          access: {
            token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;