import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from 'react-router-dom';
import { usePlatformStats } from '@/hooks/use-platform-stats';
import { CONTACT_INFO, makePhoneCall } from '@/constants/contact';
import { useAuth } from '@/contexts/AuthContext';
import { OTPVerification } from '@/components/OTPVerification';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  Shield, 
  Star,
  Phone,
  Users,
  Zap,
  ThumbsUp,
  Search,
  Calendar,
  CreditCard,
  HeadphonesIcon,
  ArrowRight,
  MapPin
} from 'lucide-react';

const JoinAsCustomer = () => {
  const { platformStats, loading } = usePlatformStats();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    referralSource: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPhone, setRegistrationPhone] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Always maintain +91 prefix
      let phoneValue = value;
      if (!phoneValue.startsWith('+91')) {
        phoneValue = '+91 ' + phoneValue.replace(/^(\+91\s*)/, '');
      }
      // Remove non-digit characters except +91 prefix
      phoneValue = phoneValue.replace(/^(\+91\s*)(.*)$/, (match, prefix, number) => {
        return prefix + number.replace(/[^\d]/g, '');
      });
      setFormData({ ...formData, phone: phoneValue });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Parse location for city and state
      const locationParts = formData.location.split(',').map(p => p.trim());
      const city = locationParts[0] || formData.location;
      const state = locationParts[1] || 'Unknown';
      
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone.replace(/\s+/g, ''),
        firstName,
        lastName,
        role: 'customer' as const,
        address: {
          city,
          state,
          pincode: '000000',
          country: 'India'
        },
        referralSource: formData.referralSource
      };
      
      await register(registrationData);
      
      // Show OTP verification step
      setRegistrationEmail(formData.email);
      setRegistrationPhone(formData.phone.replace(/\s+/g, ''));
      setShowOTPVerification(true);
      
      toast({
        title: "OTP Sent!",
        description: "Please verify your phone number to complete registration.",
      });
      
    } catch (error: any) {
      console.error('Customer registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Unable to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle OTP verification completion
  const handleVerificationComplete = () => {
    toast({
      title: "Welcome to Nagrik Sewa!",
      description: "Your account has been verified successfully.",
    });
    navigate('/dashboard');
  };

  const benefits = [
    {
      icon: Search,
      title: "Easy Service Discovery",
      description: "Find the right service provider for your needs in seconds with our smart search and filtering system."
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All our service providers are background checked and skill verified for your safety and peace of mind."
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book services instantly or schedule them for later with our flexible booking system."
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Rate and review services to help maintain high standards and help other customers choose better."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options with secure, encrypted transactions. Pay only after service completion."
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any issues or questions you might have."
    }
  ];

  // Show OTP verification step if registration was successful
  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <OTPVerification
          email={registrationEmail}
          phone={registrationPhone}
          onVerificationComplete={handleVerificationComplete}
        />
      </div>
    );
  }
  
  const serviceCategories = [
    { name: "Home Services", count: "500+ providers", icon: "🏠" },
    { name: "Cleaning", count: "300+ providers", icon: "🧹" },
    { name: "Electrical", count: "200+ providers", icon: "⚡" },
    { name: "Plumbing", count: "250+ providers", icon: "🔧" },
    { name: "Construction", count: "400+ providers", icon: "🏗️" },
    { name: "Gardening", count: "150+ providers", icon: "🌱" }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Search & Browse",
      description: "Search for services or browse categories to find what you need",
      icon: Search
    },
    {
      step: 2,
      title: "Choose Provider",
      description: "Compare profiles, ratings, and prices to select the best provider",
      icon: Users
    },
    {
      step: 3,
      title: "Book Service",
      description: "Schedule your service at a convenient time and location",
      icon: Calendar
    },
    {
      step: 4,
      title: "Get Service",
      description: "Professional arrives on time and completes the work to your satisfaction",
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Found an excellent electrician through Nagrik Sewa. Professional service and fair pricing!"
    },
    {
      name: "Raj Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "The cleaning service was amazing. Very thorough and reliable. Will definitely book again."
    },
    {
      name: "Anita Singh",
      location: "Bangalore",
      rating: 5,
      comment: "Great platform for finding home services. The booking process is so simple and convenient."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Join as a Customer
              </h1>
              <p className="text-xl md:text-2xl text-brand-100 mb-8">
                Connect with trusted service providers in your area. Get quality services at fair prices, delivered right to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Quick Booking</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-4">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Apply Now
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white bg-white/20 text-white hover:bg-white hover:text-brand-600 text-lg px-8 py-4"
                  onClick={() => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: {CONTACT_INFO.MAIN_SUPPORT_PHONE}
                </Button>
              </div>
            </div>
            <div className="lg:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <span>Loading...</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">...</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <span>Active Customers</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {platformStats?.totalCustomers.toLocaleString()}+
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <span>Service Providers</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {platformStats?.totalWorkers.toLocaleString()}+
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <span>Services Completed</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {platformStats?.completedBookings.toLocaleString()}+
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <span>Active Districts</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {platformStats?.activeDistricts}+
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Service Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/services">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                View All Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Nagrik Sewa?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <IconComponent className="w-12 h-12 text-brand-600 mb-4" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <IconComponent className="w-8 h-8 text-brand-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription>
                Create your account and start booking services in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password *</label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password (min 8 characters)"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="google">Google Search</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-brand-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-brand-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-600 hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Nagrik Sewa for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 shadow-lg">
                <UserPlus className="w-5 h-5 mr-2" />
                Apply Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white bg-white/20 text-white hover:bg-white hover:text-brand-600"
              onClick={() => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: {CONTACT_INFO.MAIN_SUPPORT_PHONE}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinAsCustomer;