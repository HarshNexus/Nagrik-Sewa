import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { WorkerProfile } from '../models/WorkerProfile';
import { authenticate as authMiddleware, generateToken, generateRefreshToken } from '../middleware/auth';
import { sendEmail } from '../services/email';
import { database } from '../config/database';
// OTP Service removed - OTP verification disabled
// import { sendSMS } from '../services/sms';
// import { OTPService, PendingUserData } from '../services/otp';

const router = express.Router();

dotenv.config();

const ensureDatabaseAvailable = (res: express.Response): boolean => {
  if (database.getConnectionStatus()) {
    return true;
  }

  res.status(503).json({
    success: false,
    message: 'Database is unavailable. Ensure MongoDB is running and MONGODB_URI is configured.'
  });
  return false;
};

const SYSTEM_ADMIN_EMAIL = process.env.SYSTEM_ADMIN_EMAIL?.trim().toLowerCase();
const SYSTEM_ADMIN_PASSWORD = process.env.SYSTEM_ADMIN_PASSWORD;
const SYSTEM_ADMIN_FIRST_NAME = process.env.SYSTEM_ADMIN_FIRST_NAME || 'System';
const SYSTEM_ADMIN_LAST_NAME = process.env.SYSTEM_ADMIN_LAST_NAME || 'Administrator';
const ENABLE_SYSTEM_ADMIN_LOGIN = process.env.ENABLE_SYSTEM_ADMIN_LOGIN === 'true';

// Validate JWT_SECRET at startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET not set in environment variables');
}

const isSystemAdminLogin = (email: string, password: string): boolean => {
  if (!ENABLE_SYSTEM_ADMIN_LOGIN || !SYSTEM_ADMIN_EMAIL || !SYSTEM_ADMIN_PASSWORD) {
    return false;
  }

  return email.toLowerCase().trim() === SYSTEM_ADMIN_EMAIL && password === SYSTEM_ADMIN_PASSWORD;
};

const generateSystemAdminToken = (): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  if (!SYSTEM_ADMIN_EMAIL) {
    throw new Error('SYSTEM_ADMIN_EMAIL is not configured');
  }

  const payload = {
    userId: 'system-admin-001',
    email: SYSTEM_ADMIN_EMAIL,
    role: 'admin',
    isSystemAdmin: true
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'nagrik-sewa',
    audience: 'nagrik-sewa-users'
  });
};

// Admin registration endpoint (one-time setup)
router.post('/register-admin', async (req, res) => {
  try {
    if (process.env.ENABLE_ADMIN_BOOTSTRAP !== 'true') {
      return res.status(404).json({
        success: false,
        message: 'Admin bootstrap endpoint is disabled'
      });
    }

    const expectedBootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
    const providedBootstrapToken = req.headers['x-admin-bootstrap-token'];
    if (!expectedBootstrapToken || providedBootstrapToken !== expectedBootstrapToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid bootstrap token'
      });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    console.log('[ADMIN-REGISTER] Request received:', { email });

    // Security: Only allow specific admin email
    if (!process.env.ADMIN_BOOTSTRAP_EMAIL || email.toLowerCase().trim() !== process.env.ADMIN_BOOTSTRAP_EMAIL.toLowerCase().trim()) {
      console.log('[ADMIN-REGISTER] Unauthorized attempt:', { email });
      return res.status(403).json({
        success: false,
        message: 'Unauthorized admin registration attempt'
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log('[ADMIN-REGISTER] Admin already exists');
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // NOTE: Do NOT hash password here - the User model pre-save hook handles hashing

    // Normalize phone number (remove country code if present)
    let normalizedPhone = phone || '9999999999';
    if (normalizedPhone.startsWith('+91')) {
      normalizedPhone = normalizedPhone.substring(3);
    } else if (normalizedPhone.startsWith('91')) {
      normalizedPhone = normalizedPhone.substring(2);
    }

    // Create admin user - password will be hashed by model's pre-save middleware
    const admin = new User({
      firstName: firstName || process.env.ADMIN_BOOTSTRAP_FIRST_NAME || 'Admin',
      lastName: lastName || process.env.ADMIN_BOOTSTRAP_LAST_NAME || 'User',
      email: process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase().trim(),
      password, // Plain password - model will hash it
      phone: normalizedPhone, // 10-digit phone number
      role: 'admin',
      address: {
        street: 'Admin Address',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      },
      isEmailVerified: true, // Admin is pre-verified
      isPhoneVerified: true,
      loginAttempts: 0,
      isTwoFactorEnabled: false,
      languagePreference: 'en',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        whatsapp: true
      },
      accountStatus: 'active'
    });

    await admin.save();
    console.log('[ADMIN-REGISTER] Admin created successfully:', { userId: admin._id });

    // Generate JWT token using centralized function
    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          role: admin.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ========================================================================
// HELPER FUNCTIONS FOR ROLE-BASED STORAGE
// ========================================================================

/**
 * Check if email already exists in BOTH collections (users & workerprofiles)
 * Returns: { exists: boolean, collection?: 'users' | 'workerprofiles' }
 */
async function checkEmailExists(email: string): Promise<{ exists: boolean; collection?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check users collection first
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return { exists: true, collection: 'users' };
  }
  
  // Check workerprofiles collection
  const workerExists = await WorkerProfile.findOne({ email: normalizedEmail });
  if (workerExists) {
    return { exists: true, collection: 'workerprofiles' };
  }
  
  return { exists: false };
}

/**
 * Check if phone already exists in BOTH collections (users & workerprofiles)
 * Returns: { exists: boolean, collection?: 'users' | 'workerprofiles' }
 */
async function checkPhoneExists(phone: string): Promise<{ exists: boolean; collection?: string }> {
  // Check users collection first
  const userExists = await User.findOne({ phone });
  if (userExists) {
    return { exists: true, collection: 'users' };
  }
  
  // Check workerprofiles collection
  const workerExists = await WorkerProfile.findOne({ phone });
  if (workerExists) {
    return { exists: true, collection: 'workerprofiles' };
  }
  
  return { exists: false };
}

// ============================================================================
// REGISTER ENDPOINT - STRICT FLOW for WORKER and CUSTOMER
// ============================================================================
// CRITICAL RULES:
// - ONLY save to ONE collection per request
// - If role === "worker" → workerprofiles ONLY
// - If role !== "worker" → users ONLY (default: customer)
// - NO double saves, NO mixed logic
// ============================================================================

router.post('/register', async (req, res) => {
  try {
    // Step 1: Ensure database is available
    if (!ensureDatabaseAvailable(res)) {
      return;
    }

    console.log('REQ BODY:', JSON.stringify(req.body, null, 2));
    console.log('ROLE:', req.body.role || 'customer (default)');

    // ========================================================================
    // STEP 1: EXTRACT ROLE
    // ========================================================================
    const role = req.body.role || "customer";

    // ========================================================================
    // STEP 2: VALIDATE PASSWORD IS PROVIDED
    // ========================================================================
    if (!req.body.password) {
      console.log('[REGISTER] Validation failed - Password required');
      return res.status(400).json({ 
        message: "Password required" 
      });
    }

    const password = req.body.password.toString();
    
    if (password.length < 8) {
      console.log('[REGISTER] Validation failed - Password too short');
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    // ========================================================================
    // STEP 3: HASH PASSWORD
    // ========================================================================
    console.log('[REGISTER] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // ========================================================================
    // STEP 4: CREATE USER / WORKER (NO CRASH) - ONE OR THE OTHER ONLY
    // ========================================================================
    let savedUser: any = null;

    // ✅ WORKER ONLY - Save to workerprofiles ONLY
    if (role === "worker") {
      console.log('[REGISTER] Path: WORKER - Saving to workerprofiles collection ONLY');
      
      // Validate worker required fields
      if (!req.body.email || !req.body.phone || !req.body.firstName) {
        return res.status(400).json({ 
          message: "Worker registration requires: email, phone, firstName" 
        });
      }

      const normalizedEmail = req.body.email.toString().toLowerCase().trim();
      const normalizedPhone = req.body.phone.toString().replace(/[^\d]/g, '').slice(-10);

      const workerData = {
        firstName: req.body.firstName || "Worker",
        lastName: req.body.lastName || "",
        email: normalizedEmail,
        password: hashedPassword,
        phone: normalizedPhone,
        description: `${req.body.primarySkill || 'Service Provider'} professional`,
        experience: parseInt(req.body.experience) || 0,
        role: "worker"
      };

      console.log('[REGISTER] Worker data:', {
        email: workerData.email,
        phone: workerData.phone,
        firstName: workerData.firstName,
        role: workerData.role
      });

      try {
        savedUser = await new WorkerProfile(workerData).save();
        console.log('[REGISTER] Worker saved:', savedUser._id);
      } catch (workerError: any) {
        console.error('[REGISTER] Worker save failed:', workerError.message);
        throw workerError;
      }

    // ✅ CUSTOMER ONLY (DEFAULT) - Save to users ONLY
    } else {
      console.log('[REGISTER] Path: CUSTOMER - Saving to users collection ONLY');
      
      // Validate customer required fields
      if (!req.body.email || !req.body.phone || !req.body.firstName) {
        return res.status(400).json({ 
          message: "Registration requires: email, phone, firstName" 
        });
      }

      const normalizedEmail = req.body.email.toString().toLowerCase().trim();
      const normalizedPhone = req.body.phone.toString().replace(/[^\d]/g, '').slice(-10);

      const userData = {
        firstName: req.body.firstName || "Customer",
        lastName: req.body.lastName || "",
        email: normalizedEmail,
        password: hashedPassword,
        phone: normalizedPhone,
        role: "customer",
        address: {
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        },
        isEmailVerified: false,
        isPhoneVerified: true,
        loginAttempts: 0,
        isTwoFactorEnabled: false,
        languagePreference: 'hi',
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
          whatsapp: true
        },
        accountStatus: 'active'
      };

      console.log('[REGISTER] Customer data:', {
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        role: userData.role
      });

      try {
        savedUser = await new User(userData).save();
        console.log('[REGISTER] Customer saved:', savedUser._id);
      } catch (customerError: any) {
        console.error('[REGISTER] Customer save failed:', customerError.message);
        throw customerError;
      }
    }

    console.log('SAVED USER:', {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role || role,
      collection: role === "worker" ? "workerprofiles" : "users"
    });

    // ========================================================================
    // STEP 5: GENERATE OTP
    // ========================================================================
    console.log('[REGISTER] Generating OTP...');
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('OTP:', otp);

    // ========================================================================
    // STEP 6: SEND OTP VIA EMAIL
    // ========================================================================
    console.log('[REGISTER] Sending OTP to:', savedUser.email);

    try {
      await sendEmail({
        to: savedUser.email,
        subject: 'Verify Your Email - Nagrik Sewa OTP',
        template: 'email-otp',
        data: {
          name: savedUser.firstName,
          otp: otp.toString(),
          expiresIn: '10 minutes'
        }
      });
      console.log('[REGISTER] OTP sent successfully');
    } catch (emailError: any) {
      console.error('[REGISTER] OTP email error:', emailError.message);
      // Continue - don't fail registration if email fails
    }

    // ========================================================================
    // STEP 7: RETURN SUCCESS RESPONSE
    // ========================================================================
    console.log('[REGISTER] Registration successful');
    
    return res.status(201).json({
      success: true,
      message: role === "worker" 
        ? "Worker registered successfully" 
        : "User registered successfully",
      role: role,
      data: {
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          phone: savedUser.phone,
          role: savedUser.role || role
        },
        collection: role === "worker" ? "workerprofiles" : "users"
      }
    });

  } catch (error) {
    // ========================================================================
    // STEP 8: ERROR HANDLING
    // ========================================================================
    console.error("REGISTER ERROR:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
});

// ============================================================================
// EMAIL OTP VERIFICATION ENDPOINTS
// Mobile OTP has been removed - only email verification is required
// ============================================================================

/**
 * Verify Email OTP
 * POST /auth/verify-email-otp
 * Verifies the email OTP and activates the user account
 */
router.post('/verify-email-otp', async (req, res) => {
  try {
    if (!ensureDatabaseAvailable(res)) {
      return;
    }

    const { email: rawEmail, otp } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    console.log('[VERIFY-EMAIL-OTP] Request received:', { email, hasOTP: !!otp });

    // Validate input
    if (!email || !otp) {
      console.log('[VERIFY-EMAIL-OTP] Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user by email
    console.log('[VERIFY-EMAIL-OTP] Looking up user...');
    const user = await User.findOne({ email });

    if (!user) {
      console.log('[VERIFY-EMAIL-OTP] User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      console.log('[VERIFY-EMAIL-OTP] Email already verified:', email);
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please login.'
      });
    }

    // Verify OTP matches
    console.log('[VERIFY-EMAIL-OTP] Verifying OTP...');
    if (!user.emailVerificationOTP || user.emailVerificationOTP !== otp) {
      console.log('[VERIFY-EMAIL-OTP] Invalid OTP:', { 
        provided: otp, 
        expected: user.emailVerificationOTP ? '[SET]' : '[NOT SET]' 
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Check if OTP has expired
    if (!user.emailOTPExpiry || user.emailOTPExpiry < new Date()) {
      console.log('[VERIFY-EMAIL-OTP] OTP expired:', { 
        expiry: user.emailOTPExpiry, 
        now: new Date() 
      });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Mark email as verified and clear OTP data
    console.log('[VERIFY-EMAIL-OTP] OTP valid, marking email as verified...');
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailOTPExpiry = undefined;
    user.accountStatus = 'active';
    await user.save();
    console.log('[VERIFY-EMAIL-OTP] Email verified successfully:', { userId: user._id });

    // Generate tokens after successful verification
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send welcome email after verification
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Nagrik Sewa - Account Verified',
        template: 'welcome',
        data: {
          name: user.firstName,
          email: user.email,
          dashboardLink: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/dashboard` : 'https://nagriksewa.co.in/dashboard'
        }
      });
      console.log('[VERIFY-EMAIL-OTP] Welcome email sent to:', user.email);
    } catch (emailError) {
      console.error('[VERIFY-EMAIL-OTP] Failed to send welcome email:', emailError);
      // Don't fail verification if welcome email fails
    }

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Nagrik Sewa.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          avatar: user.avatar
        },
        token: accessToken,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('[VERIFY-EMAIL-OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Resend Email OTP
 * POST /auth/resend-email-otp
 * Generates and sends a new email OTP
 */
router.post('/resend-email-otp', async (req, res) => {
  try {
    if (!ensureDatabaseAvailable(res)) {
      return;
    }

    const { email: rawEmail } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    console.log('[RESEND-EMAIL-OTP] Request received:', { email });

    // Validate input
    if (!email) {
      console.log('[RESEND-EMAIL-OTP] Missing email');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    console.log('[RESEND-EMAIL-OTP] Looking up user...');
    const user = await User.findOne({ email });

    if (!user) {
      console.log('[RESEND-EMAIL-OTP] User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      console.log('[RESEND-EMAIL-OTP] Email already verified:', email);
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please login.'
      });
    }

    // Generate new OTP
    console.log('[RESEND-EMAIL-OTP] Generating new OTP...');
    const emailOTP = user.generateEmailOTP();
    await user.save();
    console.log('[RESEND-EMAIL-OTP] New OTP generated and saved:', { 
      email, 
      expiresAt: user.emailOTPExpiry 
    });

    // Send verification email with new OTP
    console.log('[RESEND-EMAIL-OTP] Sending verification email...');
    let emailSent = false;
    
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: 'Your New Verification Code - Nagrik Sewa',
        template: 'email-otp',
        data: {
          name: user.firstName,
          otp: emailOTP,
          expiresIn: '10 minutes'
        }
      });
      
      emailSent = emailResult.success;
      console.log('[RESEND-EMAIL-OTP] Email send result:', {
        success: emailResult.success,
        messageId: emailResult.messageId
      });
      
      if (!emailResult.success) {
        console.error('[RESEND-EMAIL-OTP] Email sending returned failure:', emailResult.error);
      }
    } catch (emailError) {
      console.error('[RESEND-EMAIL-OTP] Email sending threw exception:', emailError);
    }
    
    // IMPORTANT: Always log OTP in development mode for testing
    if (process.env.NODE_ENV !== 'production' || !emailSent) {
      console.log('\n' + '═'.repeat(70));
      console.log('🔐 OTP FOR EMAIL VERIFICATION (DEVELOPMENT MODE)');
      console.log('═'.repeat(70));
      console.log(`Email: ${email}`);
      console.log(`OTP Code: ${emailOTP}`);
      console.log(`Expires at: ${user.emailOTPExpiry}`);
      console.log('═'.repeat(70) + '\n');
    }

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'New OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('[RESEND-EMAIL-OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// LEGACY PHONE OTP ENDPOINT (DISABLED)
// Mobile OTP verification has been removed from the system
// ============================================================================
router.post('/send-otp', async (req, res) => {
  console.log('[SEND-OTP] Legacy phone OTP endpoint called - this is disabled');
  return res.status(410).json({
    success: false,
    message: 'Phone OTP verification has been disabled. Please use email verification.'
  });
});

// Login endpoint
// MODIFIED: Added system admin credential check
router.post('/login', async (req, res) => {
  try {
    if (!ensureDatabaseAvailable(res)) {
      return;
    }

    console.log('LOGIN EMAIL:', req.body.email);

    const { email, password } = req.body;

    // Debug logging for request
    console.log('[LOGIN] Request received:', { email: email?.toLowerCase(), hasPassword: !!password });

    // Validation
    if (!email || !password) {
      console.log('[LOGIN] Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = email.toLowerCase().trim();

    // ========================================================================
    // SYSTEM ADMIN LOGIN CHECK
    // This special admin bypasses normal user authentication
    // ========================================================================
    if (isSystemAdminLogin(normalizedEmail, password)) {
      console.log('[LOGIN] System admin login successful');
      
      const adminToken = generateSystemAdminToken();
      
      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          user: {
            id: 'system-admin-001',
            _id: 'system-admin-001',
            firstName: SYSTEM_ADMIN_FIRST_NAME,
            lastName: SYSTEM_ADMIN_LAST_NAME,
            email: SYSTEM_ADMIN_EMAIL || 'system-admin@nagriksewa.local',
            phone: '0000000000',
            role: 'admin',
            avatar: null,
            isEmailVerified: true,
            isPhoneVerified: true,
            isSystemAdmin: true // Flag to identify this as the system admin
          },
          tokens: {
            accessToken: adminToken,
            refreshToken: adminToken
          },
          token: adminToken
        }
      });
    }

    // ========================================================================
    // NORMAL USER LOGIN - CHECK BOTH COLLECTIONS
    // Customers in users | Workers in workerprofiles
    // ========================================================================

    // Step 1: Check User collection (customers and admins)
    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    let foundInCollection = 'users';
    
    // Step 2: If not found in users, check WorkerProfile collection
    if (!user) {
      const worker = await WorkerProfile.findOne({ email: normalizedEmail }).select('+password');
      if (worker) {
        user = worker as any; // Cast for compatibility
        foundInCollection = 'workerprofiles';
      }
    }

    console.log('[LOGIN] Account lookup:', { found: !!user, email: normalizedEmail, collection: foundInCollection });
    
    if (!user) {
      console.log('[LOGIN] User not found for email:', normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('USER FOUND:', { id: user._id, email: user.email, collection: foundInCollection, role: user.role || 'worker' });

    // ========================================================================
    // ACCOUNT STATUS CHECKS (Only for users collection - has these fields)
    // ========================================================================
    if (foundInCollection === 'users') {
      // Check if account is blocked
      if (user.isBlocked) {
        console.log('[LOGIN] Account blocked:', { userId: user._id, reason: user.blockReason });
        return res.status(403).json({
          success: false,
          message: 'Your account has been blocked. Please contact support.'
        });
      }

      // Check if account is active
      if (user.isActive === false) {
        console.log('[LOGIN] Account inactive:', { userId: user._id });
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Check account status
      if (user.accountStatus === 'suspended') {
        console.log('[LOGIN] Account suspended:', { userId: user._id });
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Please contact support.'
        });
      }

      // Check if account is locked due to failed attempts
      if (user.lockUntil && user.lockUntil > new Date()) {
        const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
        console.log('[LOGIN] Account locked:', { userId: user._id, remainingMinutes: remainingTime });
        return res.status(423).json({
          success: false,
          message: `Account locked due to too many failed attempts. Try again in ${remainingTime} minutes.`
        });
      }
    }

    // ========================================================================
    // PASSWORD VERIFICATION - PREVENT NULL CRASH
    // ========================================================================
    if (!user.password) {
      console.log('[LOGIN] Password not set for user:', { userId: user._id, email: user.email });
      return res.status(400).json({
        success: false,
        message: 'Password not set for this user. Please contact support.'
      });
    }

    // Verify password using model method if available, otherwise use bcrypt directly
    let isPasswordValid = false;
    try {
      if (typeof user.comparePassword === 'function') {
        isPasswordValid = await user.comparePassword(password);
      } else {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
    } catch (passwordError: any) {
      console.error('[LOGIN] Password comparison error:', passwordError.message);
      return res.status(500).json({
        success: false,
        message: 'Password verification failed. Please try again.'
      });
    }
    
    console.log('[LOGIN] Password verification:', { valid: isPasswordValid, userId: user._id });
    
    if (!isPasswordValid) {
      // Increment login attempts (only for user collection)
      if (foundInCollection === 'users') {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // Lock for 2 hours
          console.log('[LOGIN] Account locked after 5 failed attempts:', { userId: user._id });
        }
        await user.save().catch((err: any) => console.error('[LOGIN] Error saving failed attempt:', err));
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful password (only for user collection)
    if (foundInCollection === 'users') {
      if (user.loginAttempts > 0 || user.lockUntil) {
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save().catch((err: any) => console.error('[LOGIN] Error resetting attempts:', err));
      }
    }

    // ========================================================================
    // OTP VERIFICATION CHECK REMOVED
    // Users are no longer required to verify email/phone before login
    // ========================================================================

    // Update last login
    user.lastLogin = new Date();
    await user.save().catch((err: any) => console.error('[LOGIN] Error updating lastLogin:', err));

    // Validate JWT_SECRET before token generation
    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact support.'
      });
    }

    // Generate access token using centralized function
    const accessToken = generateToken(user);

    // Generate refresh token using centralized function
    const refreshToken = generateRefreshToken(user);

    console.log('[LOGIN] Success:', { userId: user._id, role: user.role, collection: foundInCollection });

    // Response structure matches what frontend expects: data.user and data.tokens.accessToken
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role || 'worker',
          avatar: user.avatar || null,
          collection: foundInCollection,
          isEmailVerified: user.isEmailVerified || false,
          isPhoneVerified: user.isPhoneVerified || false
        },
        tokens: {
          accessToken,
          refreshToken
        },
        token: accessToken // Backward compatibility
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message || 'Login failed' : 'Internal Server Error'
    });
  }
});

// Get current authenticated user
// MODIFIED: Added support for system admin
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const isSystemAdmin = (req as any).user?.isSystemAdmin;
    
    // ========================================================================
    // system admin /me ENDPOINT SUPPORT
    // ========================================================================
    if (isSystemAdmin || userId === 'system-admin-001') {
      console.log('[AUTH-ME] Returning system admin user data');
      return res.json({
        success: true,
        data: {
          user: {
            _id: 'system-admin-001',
            firstName: SYSTEM_ADMIN_FIRST_NAME,
            lastName: SYSTEM_ADMIN_LAST_NAME,
            email: SYSTEM_ADMIN_EMAIL || 'system-admin@nagriksewa.local',
            phone: '0000000000',
            role: 'admin',
            avatar: null,
            isEmailVerified: true,
            isPhoneVerified: true,
            isDigiLockerVerified: false,
            languagePreference: 'en',
            notificationPreferences: {
              email: true,
              sms: false,
              push: true,
              whatsapp: false
            },
            isSystemAdmin: true
          }
        }
      });
    }
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(userId).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isDigiLockerVerified: user.isDigiLockerVerified,
          languagePreference: user.languagePreference,
          notificationPreferences: user.notificationPreferences
        }
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
});

// Debug endpoint - check if user exists (development only)
router.post('/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
        exists: false
      });
    }

    res.json({
      success: true,
      exists: true,
      data: {
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        accountStatus: user.accountStatus
      }
    });

  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user'
    });
  }
});

// Development only - Reset password for testing
router.post('/dev-reset-password', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only available in development'
      });
    }

    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Set the new password directly - it will be hashed by mongoose pre-save hook
    // Using findOneAndUpdate to bypass the pre-save hook and hash manually
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password directly in database to avoid pre-save hook
    await User.updateOne(
      { email },
      { 
        $set: { 
          password: hashedPassword,
          isEmailVerified: true,
          isPhoneVerified: true
        }
      }
    );

    console.log('[DEV-RESET] Password reset for:', email, 'New hash prefix:', hashedPassword.substring(0, 7));

    res.json({
      success: true,
      message: `Password updated successfully for ${email}`,
      data: {
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

export default router;
