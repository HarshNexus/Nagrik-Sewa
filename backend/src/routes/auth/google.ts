import { Router } from 'express';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../models/User';
import { WorkerProfile } from '../../models/WorkerProfile';
import { generateToken, generateRefreshToken } from '../../middleware/auth';

const router = Router();

// Sign in / sign up with a Google ID token from the "Sign in with Google" button.
// Only the Client ID is needed: the token is verified against Google's public keys.
router.post('/google', async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ success: false, message: 'Google sign-in is not configured on the server' });
    }

    const { credential, mode, phone } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      return res.status(400).json({ success: false, message: 'Your Google email is not verified' });
    }

    const email = payload.email.toLowerCase();
    let account: any = await User.findOne({ email });
    let role: 'customer' | 'worker' = 'customer';
    if (!account) {
      account = await WorkerProfile.findOne({ email });
      if (account) role = 'worker';
    }

    if (mode === 'register') {
      if (account) {
        return res.status(409).json({ success: false, message: 'An account already exists with this email. Please sign in.' });
      }

      // The User model requires a unique mobile number, which Google does not provide.
      const normalizedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
        return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number to sign up with Google' });
      }
      if (await User.exists({ phone: normalizedPhone }) || await WorkerProfile.exists({ phone: normalizedPhone })) {
        return res.status(409).json({ success: false, message: 'This mobile number is already registered' });
      }

      account = await new User({
        firstName: payload.given_name || payload.name || 'Google',
        lastName: payload.family_name || '',
        email,
        phone: normalizedPhone,
        // Google users never sign in with a password; this just satisfies the schema.
        password: crypto.randomBytes(24).toString('hex'),
        avatar: payload.picture,
        role: 'customer',
        isGoogleAuth: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        accountStatus: 'active',
        // Same placeholder address that normal customer registration uses
        address: { city: 'Delhi', state: 'Delhi', pincode: '110001', country: 'India' }
      }).save();
    } else if (!account) {
      return res.status(404).json({ success: false, message: 'No account found with this Google email. Please sign up first.' });
    }

    if (account.isBlocked || account.isActive === false || account.accountStatus === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account is not active. Please contact support.' });
    }

    if (role === 'customer' && payload.picture && account.avatar !== payload.picture) {
      account.avatar = payload.picture;
      await account.save();
    }

    const accessToken = generateToken(account);
    const refreshToken = generateRefreshToken(account);

    // Same response shape as POST /auth/login
    res.json({
      success: true,
      message: 'Signed in with Google',
      data: {
        user: {
          id: account._id,
          _id: account._id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: account.phone,
          role: account.role || role,
          avatar: account.avatar || null,
          isEmailVerified: account.isEmailVerified || false,
          isPhoneVerified: account.isPhoneVerified || false
        },
        tokens: { accessToken, refreshToken },
        token: accessToken
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(401).json({ success: false, message: 'Google sign-in failed. Please try again.' });
  }
});

export default router;
