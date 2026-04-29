import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  HelpCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Users,
  Shield,
  CreditCard,
  Settings
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { CONTACT_INFO, makePhoneCall, sendEmail } from "../constants/contact";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: ""
  });

  const faqCategories = [
    {
      icon: Users,
      title: "Account & Profile",
      color: "text-blue-600",
      faqs: [
        {
          question: "How do I create an account on Nagrik Sewa?",
          answer: "Creating your account is simple and secure. Download our mobile app from Google Play Store or Apple App Store, or visit our website. Click 'Sign Up' and enter your mobile number, email address, full name, and create a strong password. We'll send you an OTP for verification. Complete your profile by adding your address and preferred language. Review and accept our Terms of Service and Privacy Policy to activate your account."
        },
        {
          question: "How can I update my profile information?",
          answer: "Navigate to 'My Profile' section in the app menu or click on your profile icon on the website. Click 'Edit Profile' button to modify personal information like name, phone number, email, or address. Update your profile picture by tapping the camera icon. For security, some changes like phone number or email may require OTP verification. Always click 'Save' or 'Update Profile' to ensure your information is properly stored."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Forgot Password' link on the login page of our app or website. Provide your registered email address or mobile number associated with your account. Check your email inbox or SMS for password reset instructions (also check spam folder). Click the reset link and create a new strong password with at least 8 characters including letters and numbers. Use your new password to login and update your security settings if needed."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Bookings & Payments",
      color: "text-green-600",
      faqs: [
        {
          question: "How do I book a service?",
          answer: "Browse through our service categories like cleaning, repairs, beauty, etc., or use the search function to find specific services. Choose from verified service providers based on ratings, reviews, pricing, and availability in your area. Pick your preferred date and time slot that works best for your schedule. Provide specific requirements, special instructions, and exact address with landmarks for accurate service delivery. Complete booking by making payment through our secure gateway using cards, UPI, net banking, or select cash-on-service option."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We offer multiple secure payment options for your convenience. All major credit cards (Visa, Mastercard, Rupay), debit cards, and international cards are accepted securely. Pay instantly using UPI apps like Google Pay, PhonePe, Paytm, digital wallets, and BHIM UPI for quick transactions. Direct bank transfers from all major Indian banks including SBI, HDFC, ICICI, Axis, and regional banks are supported. Cash-on-service option is available for select services, though digital payments are recommended for safety."
        },
        {
          question: "Can I cancel or reschedule my booking?",
          answer: "Yes, we provide flexible cancellation and rescheduling options. Free cancellation or rescheduling is allowed up to 2 hours before scheduled service time for most services. Use 'My Bookings' section in app/website to cancel or reschedule with just a few taps or clicks. Cancellations made within policy timeframe receive full refund, while late cancellations may incur service provider charges. Choose new date/time from available slots, and we'll confirm with the service provider within 30 minutes."
        },
        {
          question: "How do refunds work?",
          answer: "Our refund process is transparent and customer-friendly. Refunds are initiated immediately and reflect in your account within 5-7 business days depending on your bank/payment method. Money is refunded to the original payment source - same card, UPI account, or wallet used for booking. In case of partial service completion or issues, you may receive partial refunds based on service provider policy and investigation. You'll receive SMS and email notifications with refund reference numbers to track the status."
        }
      ]
    },
    {
      icon: Shield,
      title: "Safety & Quality",
      color: "text-red-600",
      faqs: [
        {
          question: "Are service providers verified?",
          answer: "Yes, we maintain the highest verification standards for your safety and peace of mind. Every service provider submits government-issued ID proofs (Aadhaar, PAN, Driving License) which are verified by our security team. We conduct comprehensive background verification including criminal record checks and previous employment verification through authorized agencies. Practical skill tests and certifications ensure providers meet our quality standards and can deliver professional services. We also verify previous work experience and contact references to ensure reliability and professional conduct."
        },
        {
          question: "What if I'm not satisfied with the service?",
          answer: "Your satisfaction is our priority. Contact our support team within 24 hours of service completion through app, website, or helpline for fastest resolution. Our quality team will investigate your complaint by reviewing service details, contacting the provider, and assessing the situation. Based on investigation, we offer re-service at no cost, partial/full refund, or service credit for future bookings. We work with the service provider to understand and resolve the issue to prevent similar problems in future."
        },
        {
          question: "Is my home safe with your service providers?",
          answer: "We prioritize your home's security with comprehensive safety measures. All service providers are covered under our comprehensive insurance policy that protects against any damage or theft during service. GPS tracking allows you to monitor service provider location and movement, with live updates sent to your phone. We have 24/7 emergency helpline and panic button feature in app for immediate assistance during any uncomfortable situations. Service providers follow strict safety protocols including wearing ID badges, following hygiene standards, and maintaining professional conduct."
        }
      ]
    },
    {
      icon: Settings,
      title: "Technical Issues",
      color: "text-purple-600",
      faqs: [
        {
          question: "The app is not working properly. What should I do?",
          answer: "Technical issues can be frustrating, but most can be resolved quickly. Close and restart the app completely, then check if your internet connection is stable and working properly. Ensure you have the latest version by checking Google Play Store or Apple App Store for available updates and install them. Go to your device settings, find Nagrik Sewa app, and clear cache/data, then restart the app to refresh all stored data. Restart your phone/tablet completely as this resolves most temporary software conflicts and memory issues. If issues persist, contact our technical support team with your device details."
        },
        {
          question: "I'm not receiving notifications.",
          answer: "Notification issues can prevent you from staying updated. Open Nagrik Sewa app, go to Settings > Notifications, and ensure all relevant notification types are enabled. Check your phone's Settings > Apps > Nagrik Sewa > Notifications and verify that notifications are allowed and not restricted. Ensure your device's Do Not Disturb mode is off, or add Nagrik Sewa to allowed apps during DND hours. Make sure Nagrik Sewa is allowed to run in background (Settings > Battery > Background App Refresh) for timely notifications. Poor network connectivity can delay notifications - ensure you have stable internet connection."
        },
        {
          question: "Why can't I see service providers in my area?",
          answer: "Service availability depends on location and provider network. Enable location services/GPS in your device settings and allow Nagrik Sewa to access your precise location. Double-check that you've entered the correct complete address including area, city, and PIN code in your profile. We're continuously expanding our network - check our service area map or contact support to confirm coverage in your location. Some services may not be available during certain hours - try checking during peak service hours (9 AM - 8 PM). If services aren't available in your area yet, join our waitlist to be notified when we launch services in your locality."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: CONTACT_INFO.MAIN_SUPPORT_PHONE,
      availability: CONTACT_INFO.PHONE_AVAILABILITY,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      action: () => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through chat",
      contact: "Start Chat",
      availability: CONTACT_INFO.CHAT_AVAILABILITY,
      color: "bg-green-50 border-green-200 text-green-800",
      action: () => console.log("Start chat") // You can implement chat functionality here
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed queries",
      contact: CONTACT_INFO.MAIN_EMAIL,
      availability: CONTACT_INFO.EMAIL_RESPONSE_TIME,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      action: () => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Support Request")
    }
  ];

  const emergencyContacts = [
    {
      title: "Emergency Helpline",
      number: CONTACT_INFO.EMERGENCY_HELPLINE,
      description: "For immediate emergency assistance"
    },
    {
      title: "Safety Helpline",
      number: CONTACT_INFO.SAFETY_HELPLINE,
      description: "Report safety concerns or incidents"
    },
    {
      title: "Technical Emergency",
      number: CONTACT_INFO.TECHNICAL_EMERGENCY,
      description: "Critical technical issues during service"
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Support form submitted:", formData);
    alert("Thank you for contacting us! We'll get back to you within 4 hours.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Worker Help & Support</h1>
            <p className="text-xl text-brand-100 mb-8">
              We're here to help you 24/7. Find answers or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Worker Registration Prompt */}
        <section className="mb-16">
          <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-blue-50">
            <div className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-brand-600" />
                </div>
                <h2 className="text-3xl font-bold text-brand-700 mb-4">
                  Join as a Worker for Enhanced Support
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Register as a worker to get dedicated support, training opportunities, and access to professional development resources.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Priority Support</h3>
                    <p className="text-sm text-gray-600">Get faster responses and dedicated assistance</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Professional Verification</h3>
                    <p className="text-sm text-gray-600">Verify your skills and identity for better opportunities</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700 shadow-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Register as Worker
                  </Button>
                  <Button size="lg" variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white">
                    <Settings className="w-5 h-5 mr-2" />
                    Worker Login
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Worker Verification Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center text-blue-700 mb-4">
                <Shield className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold">Professional Verification & Training</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Enhance your professional profile with skill verification and access exclusive training programs for better earning opportunities.
              </p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Skill Certification</h4>
                    <p className="text-xs text-gray-600">Get certified in your skills</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Training Programs</h4>
                    <p className="text-xs text-gray-600">Access professional courses</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Identity Verification</h4>
                    <p className="text-xs text-gray-600">Secure profile verification</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Start Verification Process
                </Button>
              </div>
            </div>
          </Card>
        </section>
        
        {/* Worker Success Stories */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h2 className="text-3xl font-bold text-yellow-800 mb-4">Worker Success Stories</h2>
              <p className="text-lg text-yellow-700 max-w-2xl mx-auto">
                Join thousands of successful workers who have built thriving careers through our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Rajesh Kumar</h3>
                  <p className="text-sm text-gray-600 mb-3">Electrician, Mumbai</p>
                  <p className="text-sm text-gray-700">"Increased my monthly income by 150% within 6 months of joining the platform."</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Priya Sharma</h3>
                  <p className="text-sm text-gray-600 mb-3">House Cleaner, Delhi</p>
                  <p className="text-sm text-gray-700">"Professional training helped me get more clients and better ratings."</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Amit Patel</h3>
                  <p className="text-sm text-gray-600 mb-3">Carpenter, Bangalore</p>
                  <p className="text-sm text-gray-700">"Verification badge helped me build trust and get premium projects."</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                <Users className="w-5 h-5 mr-2" />
                Start Your Success Story
              </Button>
            </div>
          </div>
        </section>

        {/* Worker Training & Certification */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="p-8">
              <div className="text-center mb-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h2 className="text-3xl font-bold mb-4">Skill Development & Training</h2>
                <p className="text-gray-600">Enhance your skills and earning potential with our comprehensive training programs.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Free Courses</h3>
                  <p className="text-sm text-gray-600">Access to professional training courses</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <p className="text-sm text-gray-600">Get certified in multiple skill areas</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-gray-600">Connect with fellow professionals</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Higher Earnings</h3>
                  <p className="text-sm text-gray-600">Certified workers earn 30% more</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="w-5 h-5 mr-2" />
                  Explore Training
                </Button>
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                  <Shield className="w-5 h-5 mr-2" />
                  View Certifications
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Worker Benefits & Resources */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-green-800">Worker Benefits & Resources</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Shield className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Insurance Coverage</h3>
                <p className="text-sm text-green-700">Comprehensive insurance protection during work</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <CreditCard className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Instant Payments</h3>
                <p className="text-sm text-green-700">Get paid immediately after job completion</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Settings className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Professional Tools</h3>
                <p className="text-sm text-green-700">Access to professional development resources</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Get Instant Help</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Card 
                key={index} 
                className={`p-6 border-2 ${method.color} hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={method.action}
              >
                <div className="text-center">
                  <method.icon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm mb-4">{method.description}</p>
                  <p className="font-bold text-lg mb-2">{method.contact}</p>
                  <div className="flex items-center justify-center text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {method.availability}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="mb-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-red-800">Emergency Contacts</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => makePhoneCall(contact.number)}
                >
                  <h3 className="font-semibold text-red-800 mb-1">{contact.title}</h3>
                  <p className="text-2xl font-bold text-red-600 mb-2">{contact.number}</p>
                  <p className="text-sm text-red-700">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          {searchQuery && filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No results found for "{searchQuery}". Try different keywords or contact support.</p>
            </div>
          )}

          <div className="space-y-8">
            {(searchQuery ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex items-center">
                    <category.icon className={`w-6 h-6 mr-3 ${category.color}`} />
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                </div>
                
                <div className="divide-y">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    return (
                      <div key={faqIndex} className="p-6">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                          className="flex justify-between items-center w-full text-left"
                        >
                          <h4 className="font-medium text-gray-900 pr-4">{faq.question}</h4>
                          {expandedFaq === globalIndex ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === globalIndex && (
                          <div className="mt-4 text-gray-700 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 mx-auto mb-4 text-brand-600" />
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-gray-600">Send us a message and we'll get back to you within 4 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account & Profile</option>
                  <option value="booking">Booking & Payment</option>
                  <option value="safety">Safety & Quality</option>
                  <option value="technical">Technical Issues</option>
                  <option value="refund">Refund & Cancellation</option>
                  <option value="provider">Service Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
                Send Message
              </Button>
            </form>
          </div>
        </section>

        {/* Service Status */}
        <section className="mb-16">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-green-800">Service Status</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-800 mb-2">All Systems Operational</h3>
                <p className="text-green-700">✅ Website & Mobile App</p>
                <p className="text-green-700">✅ Booking System</p>
                <p className="text-green-700">✅ Payment Gateway</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Support Availability</h3>
                <p className="text-green-700">✅ Phone Support: 24/7</p>
                <p className="text-green-700">✅ Live Chat: 9 AM - 10 PM</p>
                <p className="text-green-700">✅ Email Support: Active</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
