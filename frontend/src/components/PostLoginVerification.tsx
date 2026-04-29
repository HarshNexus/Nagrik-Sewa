import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  FileText,
  User,
  Phone,
  Mail,
  X
} from 'lucide-react';
import DigiLockerAuth from './DigiLockerAuth';
import { useToast } from '../hooks/use-toast';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  icon: React.ReactNode;
}

export const PostLoginVerification: React.FC = () => {
  const API_BASE_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<string>('');
  const [showDigiLocker, setShowDigiLocker] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  // Check which verifications are needed
  const verificationSteps: VerificationStep[] = [
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your email address to receive important notifications',
      completed: user?.isEmailVerified || false,
      required: true,
      icon: <Mail className="h-4 w-4" />
    },
    {
      id: 'phone',
      title: 'Phone Verification',
      description: 'Verify your phone number for SMS notifications and security',
      completed: user?.isPhoneVerified || false,
      required: false,
      icon: <Phone className="h-4 w-4" />
    },
    {
      id: 'digilocker',
      title: 'Identity Verification',
      description: 'Verify your identity using DigiLocker for enhanced security',
      completed: user?.isDigiLockerVerified || false,
      required: false,
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const incompleteSteps = verificationSteps.filter(step => !step.completed);
  const requiredIncomplete = incompleteSteps.filter(step => step.required);

  useEffect(() => {
    // Set the first incomplete step as current
    if (incompleteSteps.length > 0 && !currentStep) {
      setCurrentStep(incompleteSteps[0].id);
    }

    // Allow skipping if no required steps are incomplete
    setCanSkip(requiredIncomplete.length === 0);
  }, [user]);

  const handleSkipVerification = () => {
    toast({
      title: "Verification Skipped",
      description: "You can complete verification later from your profile settings.",
    });
    navigate('/dashboard');
  };

  const handleCompleteVerification = () => {
    toast({
      title: "Verification Complete!",
      description: "Your account is now fully verified and secure.",
    });
    navigate('/dashboard');
  };

  const handleEmailVerification = async () => {
    try {
      const verificationUrl = `${API_BASE_URL}/auth/send-verification-email`;
      console.log('[PostLoginVerification] Calling URL:', verificationUrl);
      const response = await fetch(verificationUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email and click the verification link.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification email. Please try again.",
      });
    }
  };

  const handlePhoneVerification = async () => {
    try {
      const phoneOtpUrl = `${API_BASE_URL}/auth/send-phone-otp`;
      console.log('[PostLoginVerification] Calling URL:', phoneOtpUrl);
      const response = await fetch(phoneOtpUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
        // Here you would show an OTP input dialog
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send OTP. Please try again.",
      });
    }
  };

  const handleDigiLockerVerification = async (verificationData: any) => {
    try {
      // Send verification data to backend
      const digilockerUrl = `${API_BASE_URL}/auth/verify-digilocker`;
      console.log('[PostLoginVerification] Calling URL:', digilockerUrl);
      const response = await fetch(digilockerUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verificationData })
      });

      if (response.ok) {
        // Update user with DigiLocker verification status
        await updateUser({
          isDigiLockerVerified: true
        });

        toast({
          title: "DigiLocker Verified!",
          description: "Your identity has been successfully verified.",
        });

        setShowDigiLocker(false);
        
        // Move to next step or complete
        const nextStep = incompleteSteps.find(step => step.id !== 'digilocker' && !step.completed);
        if (nextStep) {
          setCurrentStep(nextStep.id);
        } else {
          handleCompleteVerification();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Failed to verify DigiLocker data. Please try again.",
      });
    }
  };

  // If all verifications are complete, redirect to dashboard
  if (incompleteSteps.length === 0) {
    navigate('/dashboard');
    return null;
  }

  if (showDigiLocker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDigiLocker(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DigiLockerAuth
            onVerificationComplete={handleDigiLockerVerification}
            userType={(user?.role === 'admin' ? 'customer' : user?.role) || 'customer'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Complete Your Account Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Verify your account to access all Nagrik Sewa features securely
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Verification Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  step.completed
                    ? 'bg-green-50 border-green-200'
                    : currentStep === step.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : currentStep === step.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      {step.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      {step.completed && (
                        <Badge variant="default" className="text-xs bg-green-600">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>

                {!step.completed && currentStep === step.id && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (step.id === 'email') handleEmailVerification();
                      else if (step.id === 'phone') handlePhoneVerification();
                      else if (step.id === 'digilocker') setShowDigiLocker(true);
                    }}
                  >
                    Verify Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {requiredIncomplete.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete the required verification steps to continue using Nagrik Sewa.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          {canSkip && (
            <Button variant="outline" onClick={handleSkipVerification}>
              Skip for Now
            </Button>
          )}
          
          {incompleteSteps.length === 0 && (
            <Button onClick={handleCompleteVerification} className="ml-auto">
              Continue to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
