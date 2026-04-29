import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  CheckCircle, 
  Upload, 
  User, 
  Camera, 
  FileText,
  Clock,
  Star,
  Award,
  Phone,
  Mail,
  AlertCircle,
  CreditCard,
  MapPin,
  Calendar,
  LogIn,
  UserPlus
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CONTACT_INFO, makePhoneCall, sendEmail } from "../../constants/contact";
import { useAuth } from "../../contexts/AuthContext";
import DigiLockerAuth from "../../components/DigiLockerAuth";

export default function GetVerified() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDigiLocker, setShowDigiLocker] = useState(false);
  const [isDigiLockerVerified, setIsDigiLockerVerified] = useState(user?.isDigiLockerVerified || false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    documents: {
      aadharNumber: "",
      panNumber: "",
      bankAccount: "",
      ifscCode: ""
    },
    skills: {
      primarySkill: "",
      experience: "",
      certifications: "",
      previousWork: ""
    }
  });

  const verificationSteps = [
    {
      step: 1,
      title: "Personal Information",
      description: "Basic details and contact information",
      icon: User,
      completed: false
    },
    {
      step: 2,
      title: "Document Upload",
      description: "ID proofs and legal documents",
      icon: FileText,
      completed: false
    },
    {
      step: 3,
      title: "Skill Assessment",
      description: "Skills verification and testing",
      icon: Award,
      completed: false
    },
    {
      step: 4,
      title: "Background Check",
      description: "Security and reference verification",
      icon: Shield,
      completed: false
    },
    {
      step: 5,
      title: "Final Approval",
      description: "Account activation and onboarding",
      icon: CheckCircle,
      completed: false
    }
  ];

  const requiredDocuments = [
    {
      name: "Aadhar Card",
      description: "Government-issued identity proof",
      format: "Clear photo/scan of both sides",
      required: true
    },
    {
      name: "PAN Card",
      description: "Permanent Account Number for tax purposes",
      format: "Clear photo/scan",
      required: true
    },
    {
      name: "Bank Passbook/Statement",
      description: "For salary payments",
      format: "First page with account details",
      required: true
    },
    {
      name: "Skill Certificates",
      description: "Trade/skill certifications if any",
      format: "Digital copies",
      required: false
    },
    {
      name: "Character Certificate",
      description: "From local police or government office",
      format: "Official document",
      required: false
    },
    {
      name: "Address Proof",
      description: "Utility bill or rental agreement",
      format: "Recent document (within 3 months)",
      required: true
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Priority Bookings",
      description: "Get more job opportunities with verified badge"
    },
    {
      icon: CreditCard,
      title: "Higher Earnings",
      description: "Verified workers earn 30% more on average"
    },
    {
      icon: Shield,
      title: "Customer Trust",
      description: "Customers prefer verified service providers"
    },
    {
      icon: Award,
      title: "Skill Recognition",
      description: "Display your verified skills and certifications"
    }
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleDigiLockerVerification = (verificationData: any) => {
    console.log('DigiLocker verification completed:', verificationData);
    setIsDigiLockerVerified(true);
    setShowDigiLocker(false);
    
    // Pre-populate form data from DigiLocker
    if (verificationData) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: verificationData.name || prev.personalInfo.fullName,
          dateOfBirth: verificationData.dob || prev.personalInfo.dateOfBirth,
          address: verificationData.address || prev.personalInfo.address,
        },
        documents: {
          ...prev.documents,
          aadharNumber: verificationData.aadharNumber || prev.documents.aadharNumber,
        }
      }));
    }
    
    alert('DigiLocker verification completed successfully! Your information has been pre-filled.');
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <Input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                <Input
                  type="text"
                  value={formData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  placeholder="House number, street, locality"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <Input
                  type="text"
                  value={formData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  placeholder="Your city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <Input
                  type="text"
                  value={formData.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                  placeholder="Your state"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Document Verification</h3>
            <div className="grid gap-6">
              {requiredDocuments.map((doc, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold">{doc.name}</h4>
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doc.description}</p>
                      <p className="text-xs text-gray-500">Format: {doc.format}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-800">Document Guidelines</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Upload clear, readable photos or scans</li>
                    <li>• File size should be less than 5MB</li>
                    <li>• Accepted formats: JPG, PNG, PDF</li>
                    <li>• Ensure all text is clearly visible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Skill Assessment</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skill/Service *</label>
                <select
                  value={formData.skills.primarySkill}
                  onChange={(e) => handleInputChange('skills', 'primarySkill', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">Select your primary skill</option>
                  <option value="cleaning">Home Cleaning</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical Work</option>
                  <option value="painting">Painting</option>
                  <option value="ac-repair">AC Repair</option>
                  <option value="beauty">Beauty & Wellness</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="appliance">Appliance Repair</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <select
                  value={formData.skills.experience}
                  onChange={(e) => handleInputChange('skills', 'experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>
            
            <Card className="p-6 bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Skill Assessment Process</h4>
              <div className="space-y-3 text-sm text-green-700">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Online skill questionnaire (20 questions)
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Video call with skill assessor (15 minutes)
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Practical demonstration if required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Skill certification upon passing
                </div>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Background Verification</h3>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Verification Process</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium">Identity Verification</h5>
                    <p className="text-sm text-gray-600">Verify Aadhar and PAN details with government databases</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium">Address Verification</h5>
                    <p className="text-sm text-gray-600">Physical address verification through our field team</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium">Reference Check</h5>
                    <p className="text-sm text-gray-600">Contact previous employers or customers for references</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h5 className="font-medium">Criminal Background Check</h5>
                    <p className="text-sm text-gray-600">Police verification for criminal history (if applicable)</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Verification Timeline</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Background verification typically takes 3-5 business days. We'll keep you updated via SMS and email throughout the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-semibold">Verification Complete!</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Congratulations! Your verification process is complete. You'll receive your verified badge and can start receiving customer bookings within 24 hours.
            </p>
            
            <Card className="p-6 max-w-md mx-auto">
              <h4 className="font-semibold mb-4">What's Next?</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Download Nagrik Sewa Worker App
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Complete your profile setup
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Set your availability and rates
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Start receiving bookings
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Get Verified</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Complete our comprehensive verification process to build trust with customers and unlock premium features on the Nagrik Sewa platform.
            </p>
          </div>
        </div>
      </div>

      {/* Login Prompt for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="text-2xl">Login Required</CardTitle>
                <CardDescription className="text-lg">
                  You need to be logged in to access the verification process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  To ensure the security and authenticity of your verification, please log in to your account first. 
                  If you don't have an account, you can create one in just a few minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login">
                    <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login to Continue
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-brand-50 rounded-lg">
                  <h4 className="font-semibold text-brand-700 mb-2">Why do I need to login?</h4>
                  <ul className="text-sm text-brand-600 text-left max-w-md mx-auto space-y-1">
                    <li>• Secure document upload and storage</li>
                    <li>• Track your verification progress</li>
                    <li>• Receive notifications about status updates</li>
                    <li>• Access DigiLocker integration for faster verification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* DigiLocker Verification Modal */}
      {showDigiLocker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">DigiLocker Verification</h3>
              <Button variant="ghost" onClick={() => setShowDigiLocker(false)}>
                ×
              </Button>
            </div>
            <DigiLockerAuth onVerificationComplete={handleDigiLockerVerification} userType="worker" />
          </div>
        </div>
      )}

      {/* Content for Authenticated Users */}
      {isAuthenticated && (
        <>
          {/* DigiLocker Verification Option */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-blue-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-brand-700">
                    {isDigiLockerVerified ? 'DigiLocker Verified ✓' : 'Quick Verification with DigiLocker'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {isDigiLockerVerified 
                      ? 'Your documents have been verified through DigiLocker' 
                      : 'Verify your identity instantly using your DigiLocker account'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isDigiLockerVerified ? (
                    <>
                      <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
                        DigiLocker is a secure cloud-based platform for storing and sharing authentic digital documents. 
                        Verify your identity instantly and skip manual document upload.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Button 
                          size="lg" 
                          className="bg-brand-600 hover:bg-brand-700"
                          onClick={() => setShowDigiLocker(true)}
                        >
                          <Shield className="w-5 h-5 mr-2" />
                          Verify with DigiLocker
                        </Button>
                        <Button size="lg" variant="outline">
                          Skip for Manual Verification
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-white rounded-lg border">
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-sm">Instant Verification</h4>
                          <p className="text-xs text-gray-600">Complete in seconds</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-sm">Government Verified</h4>
                          <p className="text-xs text-gray-600">Official documents</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-sm">Auto-Fill Forms</h4>
                          <p className="text-xs text-gray-600">Skip manual entry</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-green-700 font-medium mb-2">DigiLocker Verification Complete!</p>
                      <p className="text-gray-600 mb-4">Your identity has been verified through DigiLocker. You can now proceed with the verification process.</p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Continue to Verification Steps
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Benefits of Verification</h2>
            <p className="text-xl text-gray-600">Why verified workers succeed on our platform</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <benefit.icon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {verificationSteps.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                    currentStep >= step.step ? 'bg-brand-600' : 'bg-gray-300'
                  }`}>
                    {currentStep > step.step ? <CheckCircle className="w-6 h-6" /> : step.step}
                  </div>
                  <step.icon className={`w-6 h-6 mb-2 ${currentStep >= step.step ? 'text-brand-600' : 'text-gray-400'}`} />
                  <h4 className={`text-sm font-medium text-center ${currentStep >= step.step ? 'text-brand-600' : 'text-gray-400'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 text-center mt-1">{step.description}</p>
                  
                  {index < verificationSteps.length - 1 && (
                    <div className={`absolute h-0.5 w-20 mt-6 ${currentStep > step.step ? 'bg-brand-600' : 'bg-gray-300'}`} 
                         style={{ left: `${(index + 1) * 20}%`, transform: 'translateX(-50%)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8 mb-8">
            {renderStepContent()}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={currentStep === 5}
            >
              {currentStep === 4 ? 'Submit for Verification' : 'Next Step'}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with Verification?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our support team is available to assist you throughout the verification process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-brand-600 hover:bg-brand-700"
              onClick={() => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Support
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-800"
              onClick={() => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Verification Support Request")}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </Button>
          </div>
          </div>
        </section>
        </>
      )}
    </div>
  );
}
