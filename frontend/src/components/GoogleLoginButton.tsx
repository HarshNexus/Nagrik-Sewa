import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GoogleLoginButtonProps {
  mode?: 'login' | 'register';
  // Required for register mode: Google does not provide a mobile number.
  phone?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  mode = 'login',
  phone,
  onSuccess,
  onError
}) => {
  const API_BASE_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = googleClientId && !googleClientId.startsWith('your_');

  const fail = (message: string) => {
    toast({ variant: 'destructive', title: 'Google sign-in failed', description: message });
    onError?.(message);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential, mode, phone })
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || 'Google authentication failed');
      }

      localStorage.setItem('authToken', body.data.token);
      await refreshUser();
      toast({ title: 'Welcome!', description: `Signed in as ${body.data.user.firstName}` });
      navigate('/dashboard');
      onSuccess?.();
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Google authentication failed');
    }
  };

  if (!isGoogleConfigured) {
    return (
      <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
        Google sign-in is not available right now
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => fail('Google sign-in was cancelled or failed')}
          text={mode === 'register' ? 'signup_with' : 'signin_with'}
          theme="outline"
          size="large"
          width="400"
          logo_alignment="left"
        />
      </GoogleOAuthProvider>
    </div>
  );
};
