import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { authenticate as authMiddleware } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';
import { sendSMS } from '../services/sms.js';

const router = express.Router();

// DigiLocker authentication initiation
router.post('/digilocker/initiate', authMiddleware, async (req, res) => {
  try {
    const { userType } = req.body;
    const userId = (req.user as any)?._id ?? (req.user as any)?.userId;

    // In real implementation, this would generate OAuth URL for DigiLocker
    const authUrl = `https://api.digitallocker.gov.in/oauth2/1/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.DIGILOCKER_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.DIGILOCKER_REDIRECT_URI)}&` +
      `state=${userId}_${userType}&` +
      `scope=profile documents`;

    res.json({
      success: true,
      authUrl,
      message: 'DigiLocker authentication initiated'
    });
  } catch (error) {
    console.error('DigiLocker initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate DigiLocker authentication'
    });
  }
});

// DigiLocker callback handler
router.post('/digilocker/callback', authMiddleware, async (req, res) => {
  try {
    const { code, state } = req.body;
    const userId = (req.user as any)?._id ?? (req.user as any)?.userId;

    // Verify state parameter
    if (!state.startsWith(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }

    // In real implementation, exchange code for access token
    // const tokenResponse = await exchangeCodeForToken(code);
    // const userProfile = await fetchDigiLockerProfile(tokenResponse.access_token);
    
    // Mock DigiLocker response for demo
    const mockDigiLockerData = {
      aadhaar: {
        number: '123456781234', // This would be encrypted in real implementation
        name: 'RAJESH KUMAR',
        dob: '15/08/1985',
        gender: 'M',
        address: {
          house: 'H.No. 123',
          street: 'Gandhi Nagar',
          locality: 'Sector 15',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001'
        }
      },
      documents: ['Aadhaar Card', 'PAN Card'],
      verificationId: crypto.randomBytes(16).toString('hex')
    };

    // Encrypt Aadhaar number before storing
    const encryptedAadhaar = await bcrypt.hash(mockDigiLockerData.aadhaar.number, 12);

    // Update user with verification data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isDigiLockerVerified: true,
        digiLockerData: {
          aadhaarNumber: encryptedAadhaar,
          name: mockDigiLockerData.aadhaar.name,
          dob: mockDigiLockerData.aadhaar.dob,
          gender: mockDigiLockerData.aadhaar.gender,
          address: mockDigiLockerData.aadhaar.address,
          verificationDate: new Date(),
          verificationId: mockDigiLockerData.verificationId,
          documentsVerified: mockDigiLockerData.documents
        }
      },
      { new: true }
    ).select('-password -digiLockerData.aadhaarNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send verification success email
    try {
      await sendEmail({
        to: user.email,
        subject: 'DigiLocker Verification Successful',
        html: `
        <h2>DigiLocker Verification Complete</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your identity has been successfully verified through DigiLocker. You now have a verified badge on your profile.</p>
        <p>Verification Details:</p>
        <ul>
          <li>Verification Date: ${new Date().toLocaleDateString()}</li>
          <li>Documents Verified: ${mockDigiLockerData.documents.join(', ')}</li>
          <li>Verification ID: ${mockDigiLockerData.verificationId}</li>
        </ul>
        <p>This verification enhances your profile credibility and helps other users trust your services.</p>
        <p>Best regards,<br>Nagrik Sewa Team</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.json({
      success: true,
      message: 'DigiLocker verification completed successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isDigiLockerVerified: user.isDigiLockerVerified,
        verificationData: user.digiLockerData
      }
    });
  } catch (error) {
    console.error('DigiLocker callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete DigiLocker verification'
    });
  }
});

// Verify Aadhaar number (mock implementation)
router.post('/digilocker/verify-aadhaar', authMiddleware, [
  body('aadhaarNumber')
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be 12 digits')
    .isNumeric()
    .withMessage('Aadhaar number must contain only digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { aadhaarNumber } = req.body;
    const userId = req.user.id;

    // Check if Aadhaar is already verified by another user
    const existingUser = await User.findOne({
      'digiLockerData.aadhaarNumber': { $exists: true },
      _id: { $ne: userId }
    });

    // In real implementation, we would check against encrypted hash
    // For demo, we'll skip this check

    // Mock verification process
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    // Generate mock verification data
    const verificationData = {
      aadhaar: {
        number: 'XXXX-XXXX-' + aadhaarNumber.slice(-4),
        name: 'RAJESH KUMAR',
        dob: '15/08/1985',
        gender: 'M',
        address: {
          house: 'H.No. 123',
          street: 'Gandhi Nagar',
          locality: 'Sector 15',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001'
        }
      },
      documents: [
        {
          name: 'Aadhaar Card',
          type: 'identity',
          verified: true,
          issueDate: '2019-03-15'
        }
      ],
      verificationTimestamp: new Date().toISOString(),
      verificationStatus: 'verified'
    };

    res.json({
      success: true,
      message: 'Aadhaar verification successful',
      data: verificationData
    });
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Aadhaar verification failed'
    });
  }
});

// Get verification status
router.get('/verification-status', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)?._id ?? (req.user as any)?.userId;
    const user = await User.findById(userId)
      .select('isEmailVerified isPhoneVerified isDigiLockerVerified digiLockerData')
      .populate('digiLockerData', '-aadhaarNumber'); // Exclude encrypted Aadhaar

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      verificationStatus: {
        email: user.isEmailVerified,
        phone: user.isPhoneVerified,
        digiLocker: user.isDigiLockerVerified,
        government: user.isDigiLockerVerified, // Government verification through DigiLocker
        digiLockerData: user.digiLockerData
      }
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
});

// Revoke DigiLocker verification
router.delete('/digilocker/revoke', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)?._id ?? (req.user as any)?.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          digiLockerData: 1
        },
        isDigiLockerVerified: false
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'DigiLocker verification revoked successfully'
    });
  } catch (error) {
    console.error('Revoke DigiLocker verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke DigiLocker verification'
    });
  }
});

export default router;