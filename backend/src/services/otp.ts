import { authenticator } from 'otplib';
import crypto from 'crypto';

interface OTPData {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, OTPData>();

// Temporary storage for pending registrations (before OTP verification)
export interface PendingUserData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  address?: {
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  languagePreference?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  // Worker-specific data
  workerData?: {
    district?: string;
    primarySkill?: string;
    experience?: string;
  };
  expiresAt: Date;
}

const pendingUsers = new Map<string, PendingUserData>();

export class OTPService {
  private static readonly OTP_EXPIRY_MINUTES = 10;
  private static readonly MAX_ATTEMPTS = 3;

  // Store pending user registration data
  static storePendingUser(identifier: string, userData: PendingUserData): void {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);
    userData.expiresAt = expiresAt;
    pendingUsers.set(identifier, userData);
  }

  // Retrieve pending user data
  static getPendingUser(identifier: string): PendingUserData | undefined {
    const userData = pendingUsers.get(identifier);
    if (userData && userData.expiresAt > new Date()) {
      return userData;
    }
    // Clean up expired data
    if (userData) {
      pendingUsers.delete(identifier);
    }
    return undefined;
  }

  // Remove pending user after successful verification
  static removePendingUser(identifier: string): void {
    pendingUsers.delete(identifier);
  }

  // Generate a 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with expiry
  static storeOTP(identifier: string, otp: string): void {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    otpStorage.set(identifier, {
      otp,
      expiresAt,
      attempts: 0
    });

    // Clean up expired OTPs
    this.cleanExpiredOTPs();
  }

  // Verify OTP
  static verifyOTP(identifier: string, inputOTP: string): { success: boolean; message: string } {
    const storedData = otpStorage.get(identifier);

    if (!storedData) {
      return { success: false, message: 'OTP not found or expired' };
    }

    // Check if expired
    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(identifier);
      return { success: false, message: 'OTP has expired' };
    }

    // Check attempts
    if (storedData.attempts >= this.MAX_ATTEMPTS) {
      otpStorage.delete(identifier);
      return { success: false, message: 'Too many invalid attempts' };
    }

    // Verify OTP
    if (storedData.otp === inputOTP) {
      otpStorage.delete(identifier);
      return { success: true, message: 'OTP verified successfully' };
    } else {
      storedData.attempts++;
      return { success: false, message: 'Invalid OTP' };
    }
  }

  // Check if OTP exists for identifier
  static hasValidOTP(identifier: string): boolean {
    const storedData = otpStorage.get(identifier);
    if (!storedData) return false;
    
    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(identifier);
      return false;
    }
    
    return true;
  }

  // Clean up expired OTPs
  private static cleanExpiredOTPs(): void {
    const now = new Date();
    for (const [identifier, data] of otpStorage.entries()) {
      if (now > data.expiresAt) {
        otpStorage.delete(identifier);
      }
    }
  }

  // Get OTP info (for testing/debugging)
  static getOTPInfo(identifier: string): { exists: boolean; expiresAt?: Date; attempts?: number } {
    const storedData = otpStorage.get(identifier);
    if (!storedData) {
      return { exists: false };
    }

    return {
      exists: true,
      expiresAt: storedData.expiresAt,
      attempts: storedData.attempts
    };
  }
}

// Generate unique identifier for OTP storage
export const generateOTPIdentifier = (type: 'email' | 'phone', value: string): string => {
  return `${type}:${crypto.createHash('sha256').update(value).digest('hex').substring(0, 16)}`;
};