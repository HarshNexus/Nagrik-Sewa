import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText,
  Download,
  Upload,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface DigiLockerAuthProps {
  onVerificationComplete: (data: any) => void;
  userType: 'customer' | 'worker';
}

export default function DigiLockerAuth({ onVerificationComplete, userType }: DigiLockerAuthProps) {
  const [step, setStep] = useState(1); // 1: Connect, 2: Consent, 3: Verification, 4: Complete
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationData, setVerificationData] = useState<any>(null);

  // Mock DigiLocker verification data
  const mockVerificationData = {
    aadhaar: {
      number: 'XXXX-XXXX-1234',
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
      },
      photo: null // In real implementation, this would be base64 image
    },
    documents: [
      {
        name: 'Aadhaar Card',
        type: 'identity',
        verified: true,
        issueDate: '2019-03-15'
      },
      {
        name: 'PAN Card',
        type: 'identity',
        verified: true,
        issueDate: '2018-12-10'
      }
    ],
    verificationTimestamp: new Date().toISOString(),
    verificationStatus: 'verified'
  };

  const handleDigiLockerConnect = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate DigiLocker OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would redirect to DigiLocker
      // window.location.href = 'https://api.digitallocker.gov.in/oauth2/1/authorize?...';
      
      setStep(2);
    } catch (err) {
      setError('Failed to connect to DigiLocker. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentGiven = () => {
    setStep(3);
  };

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate Aadhaar verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would call DigiLocker API
      setVerificationData(mockVerificationData);
      setStep(4);
      
      // Call parent callback with verification data
      onVerificationComplete(mockVerificationData);
    } catch (err) {
      setError('Aadhaar verification failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Connect to DigiLocker', description: 'Authorize secure access' },
    { number: 2, title: 'Give Consent', description: 'Allow document access' },
    { number: 3, title: 'Verify Aadhaar', description: 'Confirm your identity' },
    { number: 4, title: 'Complete', description: 'Verification successful' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">DigiLocker Verification</h1>
        <p className="text-gray-600">
          Verify your identity securely using DigiLocker for {userType === 'worker' ? 'worker registration' : 'enhanced profile security'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepItem.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepItem.number
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium">{stepItem.title}</p>
                  <p className="text-xs text-gray-500">{stepItem.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Connect to DigiLocker */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Connect to DigiLocker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What is DigiLocker?</h3>
              <p className="text-blue-800 text-sm">
                DigiLocker is a Government of India initiative that provides secure access to your documents. 
                We use it to verify your identity safely without storing your personal documents.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Benefits of DigiLocker verification:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Government-verified identity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Enhanced profile trust</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Faster {userType === 'worker' ? 'worker approval' : 'service booking'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure document verification</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleDigiLockerConnect}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting to DigiLocker...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Connect with DigiLocker
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By clicking above, you'll be redirected to DigiLocker's secure authentication portal.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Consent */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Document Access Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Consent Required</h3>
              <p className="text-amber-800 text-sm">
                We need your permission to access the following documents from DigiLocker for verification purposes.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Documents we'll access:</h4>
              <div className="space-y-2">
                {[
                  { name: 'Aadhaar Card', purpose: 'Identity verification' },
                  { name: 'PAN Card', purpose: 'Tax identification (if available)' },
                  { name: 'Address Proof', purpose: 'Location verification' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">{doc.purpose}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Data Protection</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Your documents are never stored on our servers</li>
                <li>• Only verification status is saved</li>
                <li>• Data is encrypted during transmission</li>
                <li>• You can revoke access anytime</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConsentGiven} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Give Consent & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Aadhaar Verification */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Verify Your Aadhaar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Aadhaar Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={aadhaarNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 12) {
                      setAadhaarNumber(value);
                    }
                  }}
                  maxLength={12}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Aadhaar number is encrypted and never stored in plain text
                </p>
              </div>

              {aadhaarNumber.length === 12 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Aadhaar number format is valid. Click verify to proceed.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleAadhaarVerification}
                disabled={isLoading || aadhaarNumber.length !== 12}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Aadhaar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Verification Complete */}
      {step === 4 && verificationData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Verification Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Successfully Verified!</h3>
              <p className="text-green-800 text-sm">
                Your identity has been verified through DigiLocker. You now have a verified badge on your profile.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Verified Information:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Name</p>
                    <p className="text-xs text-gray-600">{verificationData.aadhaar.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Date of Birth</p>
                    <p className="text-xs text-gray-600">{verificationData.aadhaar.dob}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-xs text-gray-600">
                      {verificationData.aadhaar.address.city}, {verificationData.aadhaar.address.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Verification Status</p>
                    <p className="text-xs text-green-600 font-medium">VERIFIED</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Verified Documents:</h4>
              {verificationData.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-600">Issued: {doc.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}