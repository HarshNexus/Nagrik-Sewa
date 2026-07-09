import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { toast } from '@/hooks/use-toast';

interface User {
  id?: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'worker' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isDigiLockerVerified?: boolean;
  isSystemAdmin?: boolean; // Flag for system admin
  preferences?: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // Helper to check if user is admin
  login: (email: string, password: string, role?: 'customer' | 'worker') => Promise<User | { requiresRoleSelection: true; availableRoles: Array<'customer' | 'worker'>; message?: string }>;
  register: (data: RegisterData) => Promise<any>;
  verifyOTP: (email: string, otp: string, accountType?: 'customer' | 'worker') => Promise<any>;
  sendOTP: (email: string, accountType?: 'customer' | 'worker') => Promise<any>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'worker';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');

logger.debug('[AUTH] Environment:', {
  API_URL,
  isDevelopment: import.meta.env.DEV,
  isSameSite: typeof document !== 'undefined' && document.location.protocol === 'https:',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  
  // ============================================================================
  // ADMIN CHECK HELPER
  // Returns true if user is admin (either hardcoded or database admin)
  // ============================================================================
  const isAdmin = user?.role === 'admin' || user?.isSystemAdmin === true;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          logger.debug('Auth me response:', response.data);
          setUser(response.data.data.user); // Fix: correct path to user data
        } catch (error) {
          logger.error('Auth initialization failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role?: 'customer' | 'worker') => {
    try {
      const loginUrl = `${API_URL}/auth/login`;
      
      logger.debug('[AUTH] Login attempt:', {
        url: loginUrl,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        origin: window.location.origin,
      });
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
        credentials: 'include', // ✓ CRITICAL: Enables cookie persistence
      });

      const responseData = await response.json();

      if (!response.ok) {
        logger.error('[AUTH] Login failed:', {
          status: response.status,
          message: responseData?.message,
          headers: Object.fromEntries(response.headers.entries()),
        });
        throw new Error(responseData?.message || 'Login failed');
      }

      if (responseData?.requiresRoleSelection) {
        return {
          requiresRoleSelection: true,
          availableRoles: responseData.availableRoles || ['customer', 'worker'],
          message: responseData.message,
        };
      }

      logger.debug('[AUTH] Login response received:', {
        hasUser: !!responseData.data?.user,
        hasToken: !!responseData.data?.tokens?.accessToken,
        setCookieHeader: response.headers.get('set-cookie') ? 'Yes' : 'No',
        corsHeaders: {
          'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        },
      });
      
      // Handle the correct response structure from server
      const { user, tokens, token } = responseData.data;
      // Use tokens.accessToken if available, fallback to token for backward compatibility
      const accessToken = tokens?.accessToken || token;
      
      if (!accessToken) {
        throw new Error('No access token in response');
      }
      
      localStorage.setItem('authToken', accessToken);
      setUser(user);
      
      logger.debug('[AUTH] Login successful:', { userId: user.id, role: user.role });
      
      toast({
        title: "Welcome back!",
        description: `Logged in successfully as ${user.firstName}`,
      });
      
      // Return user for role-based redirect handling
      return user;
    } catch (error: any) {
      logger.error('[AUTH] Login error:', error);
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
        duration: 5000, // Show error for 5 seconds
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Normalize email
      const normalizedData = {
        ...data,
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || ''
      };
      
      logger.debug('Starting registration...', { ...normalizedData, password: '[HIDDEN]' });
      const response = await api.post('/auth/register', normalizedData);
      logger.debug('Registration response:', response.data);
      
      // ========================================================================
      // DO NOT AUTO-LOGIN - Wait for OTP verification
      // The token is NOT stored here. User must verify OTP first.
      // ========================================================================
      
      toast({
        title: "Registration Successful!",
        description: "Please verify your email with the OTP sent to complete registration.",
      });

      // Return the response for the component to handle OTP verification
      return response.data;
    } catch (error: any) {
      logger.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  // ============================================================================
  // OTP VERIFICATION FUNCTIONS
  // ============================================================================
  
  const sendOTP = async (email: string, accountType: 'customer' | 'worker' = 'customer') => {
    try {
      const response = await api.post('/auth/resend-email-otp', { email, accountType });
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your email",
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast({
        title: "Failed to send OTP",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string, accountType: 'customer' | 'worker' = 'customer') => {
    try {
      const response = await api.post('/auth/verify-email-otp', { email, otp, accountType });
      const { user: verifiedUser, tokens } = response.data.data;
      
      if (tokens?.accessToken) {
        localStorage.setItem('authToken', tokens.accessToken);
        setUser(verifiedUser);
        
        toast({
          title: "Verified!",
          description: "Your email has been verified successfully.",
        });
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });    // Redirect to home page after logout
    window.location.href = '/';  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await api.patch('/auth/profile', data);
      setUser(response.data.user);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      // Handle correct response structure: response.data.data.user
      const userData = response.data.data?.user || response.data.user;
      if (userData) {
        setUser(userData);
      } else {
        logger.error('[AUTH] Invalid user data in refresh response');
        logout();
      }
    } catch (error) {
      logger.error('[AUTH] Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    verifyOTP,
    sendOTP,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
