import React, { useState, useEffect } from 'react';
import { Link, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2, User, Wrench } from 'lucide-react';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { PhoneInput, usePhoneValidation } from '@/components/PhoneInput';
import { OTPVerification } from '@/components/OTPVerification';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+91 ', // Default Indian country code
    password: '',
    confirmPassword: '',
    role: (roleParam === 'worker' ? 'worker' : 'customer') as 'customer' | 'worker',
    // Worker-specific fields
    district: '',
    primarySkill: '',
    experience: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState<{
    email: string;
    phone: string;
  } | null>(null);

  const { register, isAuthenticated } = useAuth();
  const { validatePhoneNumber } = usePhoneValidation();

  // Update role if URL param changes
  useEffect(() => {
    if (roleParam === 'worker' || roleParam === 'customer') {
      setFormData(prev => ({ ...prev, role: roleParam as 'customer' | 'worker' }));
    }
  }, [roleParam]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle phone number to maintain +91 prefix
    if (name === 'phone') {
      let phoneValue = value;
      // Ensure phone always starts with +91
      if (!phoneValue.startsWith('+91')) {
        phoneValue = '+91 ' + phoneValue.replace(/^(\+91\s*)/, '');
      }
      // Remove any non-digit characters except +, space, and the initial +91
      phoneValue = phoneValue.replace(/^(\+91\s*)(.*)$/, (match, prefix, number) => {
        return prefix + number.replace(/[^\d]/g, '');
      });
      // Limit to 10 digits after +91
      if (phoneValue.length > 14) { // +91 + space + 10 digits = 14 characters
        phoneValue = phoneValue.substring(0, 14);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || 'Invalid phone number');
      setIsLoading(false);
      return;
    }

    // Validate worker-specific fields
    if (formData.role === 'worker') {
      if (!formData.district) {
        setError('District is required for workers');
        setIsLoading(false);
        return;
      }
      if (!formData.primarySkill) {
        setError('Primary skill is required for workers');
        setIsLoading(false);
        return;
      }
      if (!formData.experience) {
        setError('Experience is required for workers');
        setIsLoading(false);
        return;
      }
    }

    try {
      const registrationPayload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      // Add worker-specific fields if role is worker
      if (formData.role === 'worker') {
        registrationPayload.district = formData.district;
        registrationPayload.primarySkill = formData.primarySkill;
        registrationPayload.experience = formData.experience;
      }

      const result = await register(registrationPayload);
      
      // Show OTP verification step after successful registration
      if (result.success) {
        console.log('[Register] Registration successful, showing OTP verification');
        setRegistrationData({
          email: formData.email,
          phone: formData.phone
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification completion
  const handleVerificationComplete = () => {
    console.log('[Register] OTP verification complete, redirecting to dashboard');
    navigate('/dashboard', { replace: true });
  };

  // Show OTP verification step if registration was successful
  if (registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <OTPVerification
          email={registrationData.email}
          phone={registrationData.phone}
          onVerificationComplete={handleVerificationComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join Nagrik Sewa community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={formData.role}
            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'customer' | 'worker' }))}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="worker" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Worker
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <PhoneInput
              value={formData.phone}
              onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              required
              label="Phone Number"
              showHint={true}
            />

            {/* Worker-specific fields */}
            {formData.role === 'worker' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primarySkill">Primary Skill *</Label>
                  <select
                    id="primarySkill"
                    name="primarySkill"
                    value={formData.primarySkill}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select your primary skill</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="House Cleaner">House Cleaner</option>
                    <option value="Painter">Painter</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Gardener">Gardener</option>
                    <option value="Construction Worker">Construction Worker</option>
                    <option value="Beauty Professional">Beauty Professional</option>
                    <option value="Cook">Cook</option>
                    <option value="Driver">Driver</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth temporarily disabled until properly configured */}
            <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
              Google Sign-In (Configure OAuth in .env)
              <br />
              <span className="text-xs">Set VITE_GOOGLE_CLIENT_ID with a valid Google OAuth Client ID</span>
            </div>

            {/* 
            <GoogleLoginButton 
              mode="register"
              onSuccess={() => {
                // Redirect will be handled by the GoogleLoginButton
              }}
              onError={(error) => {
                setError(error);
              }}
            />
            */}

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
