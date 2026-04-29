/**
 * ============================================================================
 * OTP VERIFICATION COMPONENT
 * Handles email OTP verification during registration
 * ============================================================================
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  phone?: string;
  onVerificationComplete: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationComplete
}) => {
  const [emailOTP, setEmailOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!emailOTP) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      const response = await api.post('/auth/verify-email-otp', { email, otp: emailOTP });
      if (response.data.success) {
        // Store token if returned
        if (response.data.data?.token) {
          localStorage.setItem('authToken', response.data.data.token);
        }
        onVerificationComplete();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await api.post('/auth/resend-email-otp', { email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email OTP ({email})
          </label>
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value)}
            maxLength={6}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying || !emailOTP}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Account'
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleResendOTP}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend OTP
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Enter the OTP code sent to your email to complete registration.
        </p>
      </CardContent>
    </Card>
  );
};