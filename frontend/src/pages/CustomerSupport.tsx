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
  Settings,
  FileText
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { useToast } from '../hooks/use-toast';
import { CONTACT_INFO, makePhoneCall, sendEmail } from '../constants/contact';

export default function CustomerSupport() {
  const { toast } = useToast();
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
      title: "Account & Bookings", 
      color: "text-blue-600",
      faqs: [
        {
          question: "How do I create a customer account?",
          answer: "Creating your customer account is easy! Download our app or visit our website, click 'Sign Up' and enter your mobile number, email, and basic details. Verify your phone number with OTP and complete your profile with your address and preferences. You can then start browsing and booking services immediately."
        },
        {
          question: "How do I book a service?",
          answer: "Browse our service categories like cleaning, repairs, beauty, etc. Select a service and choose from verified providers based on ratings, reviews, pricing, and availability in your area. Pick your preferred date and time, provide specific requirements, and complete your booking with secure payment through our platform."
        },
        {
          question: "Can I cancel or reschedule my booking?",
          answer: "Yes! You can cancel or reschedule your booking up to 2 hours before the scheduled service time through your dashboard or our app. Free cancellation is available within our policy timeframe. For late cancellations, minimal charges may apply as per our terms and service provider policies."
        },
        {
          question: "How do I track my service request?",
          answer: "Once your booking is confirmed, you can track your service provider in real-time through our app. You'll receive SMS and push notifications about your service status, including when the provider is on their way. You can also call our support helpline for live updates on your service request."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Pricing",
      color: "text-green-600", 
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major payment methods for your convenience: Credit/Debit cards (Visa, Mastercard, RuPay), UPI payments (Google Pay, PhonePe, Paytm, BHIM), Net Banking from all major banks, Digital wallets, and Cash-on-Service for select services. All digital payments are processed through secure, encrypted gateways."
        },
        {
          question: "How is service pricing determined?",
          answer: "Our pricing is transparent and competitive. Each service has base rates displayed upfront, with additional charges for specific requirements or premium services clearly mentioned. Prices may vary based on location, service complexity, time slots, and provider experience. You'll see the total cost before confirming your booking with no hidden charges."
        },
        {
          question: "How do refunds work?",
          answer: "Refunds are processed based on our refund policy. For cancellations within the free cancellation period, you'll receive a full refund within 5-7 business days to your original payment method. Partial refunds may apply for service issues or incomplete work, which are reviewed case-by-case by our support team."
        },
        {
          question: "Are there any hidden charges?",
          answer: "No, we believe in complete transparency! All charges including service fees, taxes, and any additional costs are clearly displayed before you confirm your booking. The price you see at checkout is exactly what you'll pay. We never add surprise charges or hidden fees to your final bill."
        }
      ]
    },
    {
      icon: Shield,
      title: "Safety & Quality",
      color: "text-red-600",
      faqs: [
        {
          question: "Are service providers verified and safe?",
          answer: "Absolutely! Every service provider undergoes comprehensive verification including government ID verification (Aadhaar, PAN), background checks, skill assessments, and reference verification. We also conduct police verification for safety-sensitive services and maintain detailed profiles with ratings and reviews from other customers."
        },
        {
          question: "What if I'm not satisfied with the service?",
          answer: "Your satisfaction is our top priority! If you're not happy with the service, contact us within 24 hours through the app, website, or helpline. We'll investigate your complaint and offer solutions including re-service at no cost, partial/full refunds, or service credits. We also work with providers to prevent similar issues."
        },
        {
          question: "Is my home safe with your service providers?",
          answer: "Yes, we take home security very seriously. All service providers carry ID badges, are covered under our comprehensive insurance policy, and are GPS-tracked during service. We have 24/7 emergency support, and our app includes a panic button feature for immediate assistance during any uncomfortable situations."
        },
        {
          question: "How do you ensure service quality?",
          answer: "We maintain high quality standards through regular training programs for service providers, customer feedback systems, quality audits, and a rating system that helps maintain service excellence. Poor-performing providers are retrained or removed from our platform to ensure consistently high-quality service delivery."
        }
      ]
    },
    {
      icon: Settings,
      title: "Technical Support",
      color: "text-purple-600",
      faqs: [
        {
          question: "The app is not working properly. What should I do?",
          answer: "Try these quick fixes: Close and restart the app completely, check your internet connection, update the app from Google Play Store or Apple App Store, clear app cache in your device settings, or restart your phone. If issues persist, contact our technical support team with your device details for personalized assistance."
        },
        {
          question: "I'm not receiving booking notifications.",
          answer: "Check if notifications are enabled for Nagrik Sewa in your phone's Settings > Apps > Notifications. Ensure the app has permission to send notifications and is not restricted by battery optimization or Do Not Disturb mode. Also verify that your device has a stable internet connection for timely notification delivery."
        },
        {
          question: "Why can't I see available service providers?",
          answer: "This could be due to location settings. Enable GPS/location services in your device settings and allow Nagrik Sewa to access your location. Verify your address is correct and within our service areas. Some services may have limited availability during certain hours - try checking during peak service hours (9 AM - 8 PM)."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to 'My Profile' section in the app menu or click your profile picture on the website. Click 'Edit Profile' to modify your personal information, address, or preferences. For security, some changes like phone number or email may require OTP verification. Always save your changes to ensure they're updated properly."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: CONTACT_INFO.CUSTOMER_SUPPORT_PHONE,
      availability: CONTACT_INFO.PHONE_AVAILABILITY,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      action: () => makePhoneCall(CONTACT_INFO.CUSTOMER_SUPPORT_PHONE)
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
    toast({
      title: "Support Request Submitted!",
      description: "We'll get back to you within 4 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      subject: "",
      message: ""
    });
  };

  const handleDownloadGuide = () => {
    window.open('/documents/customer-guide.pdf', '_blank');
    toast({
      title: "Downloading Guide",
      description: "Customer guide will download shortly",
    });
  };

  const handleViewAllFAQs = () => {
    window.open('/support/faqs', '_blank');
    toast({
      title: "Opening FAQs",
      description: "View all frequently asked questions",
    });
  };

  const handleJoinForum = () => {
    window.open('/community/forum', '_blank');
    toast({
      title: "Opening Community Forum",
      description: "Connect with other customers",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Customer Help & Support</h1>
            <p className="text-xl text-brand-100 mb-8">
              We're here to help you 24/7. Find answers or get in touch with our support team.
            </p>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        
        {/* Support Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How Can We Help You?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-center mb-2">Account & Bookings</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Create account, book services, track orders</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Account & Bookings Support")}
              >
                Get Help
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-center mb-2">Payments & Refunds</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Payment methods, refunds, pricing</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Payment Support")}
              >
                Get Help
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-center mb-2">Safety & Quality</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Service quality, safety concerns</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Safety & Quality Support")}
              >
                Get Help
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-center mb-2">App & Technical</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Technical issues, app problems</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => sendEmail(CONTACT_INFO.MAIN_EMAIL, "Technical Support")}
              >
                Get Help
              </Button>
            </Card>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-brand-50 to-brand-100">
              <Clock className="w-8 h-8 mx-auto mb-2 text-brand-600" />
              <div className="text-3xl font-bold text-brand-700">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-700">&lt;2hrs</div>
              <p className="text-gray-600">Average Response Time</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-blue-700">50K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </Card>
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

        {/* Customer Account Benefits */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center text-blue-700 mb-4">
                <Shield className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold">Customer Account Benefits</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Create your customer account to access exclusive benefits and enhanced support experience.
              </p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Booking History</h4>
                    <p className="text-xs text-gray-600">Track all your services</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Priority Support</h4>
                    <p className="text-xs text-gray-600">Faster assistance</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Secure Payments</h4>
                    <p className="text-xs text-gray-600">Protected transactions</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Create Customer Account
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Customer Success Stories */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h2 className="text-3xl font-bold text-yellow-800 mb-4">Customer Success Stories</h2>
              <p className="text-lg text-yellow-700 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us for their daily service needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Meera Singh</h3>
                  <p className="text-sm text-gray-600 mb-3">Working Professional, Delhi</p>
                  <p className="text-sm text-gray-700">"Quick service booking and reliable professionals. Saved me hours every week!"</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Rahul Gupta</h3>
                  <p className="text-sm text-gray-600 mb-3">Homeowner, Mumbai</p>
                  <p className="text-sm text-gray-700">"Excellent customer support and verified service providers. Highly recommended!"</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Ankita Sharma</h3>
                  <p className="text-sm text-gray-600 mb-3">Business Owner, Bangalore</p>
                  <p className="text-sm text-gray-700">"Safe, secure, and affordable services. The app makes booking so convenient!"</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                <Users className="w-5 h-5 mr-2" />
                Book Your First Service
              </Button>
            </div>
          </div>
        </section>

        {/* Customer Benefits & Features */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="p-8">
              <div className="text-center mb-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h2 className="text-3xl font-bold mb-4">Customer Benefits & Features</h2>
                <p className="text-gray-600">Experience the best in service booking with our customer-focused features.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Easy Booking</h3>
                  <p className="text-sm text-gray-600">Book services in just a few clicks</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Verified Providers</h3>
                  <p className="text-sm text-gray-600">All service providers are verified</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Round-the-clock customer assistance</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600">Multiple secure payment options</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="w-5 h-5 mr-2" />
                  Explore Services
                </Button>
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                  <Shield className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Customer Protection & Safety */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-green-800">Customer Protection & Safety</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Shield className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Service Guarantee</h3>
                <p className="text-sm text-green-700">100% satisfaction guarantee on all services</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <CreditCard className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Secure Transactions</h3>
                <p className="text-sm text-green-700">Safe and encrypted payment processing</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Users className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">Background Verified</h3>
                <p className="text-sm text-green-700">All service providers are background checked</p>
              </div>
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
              <p className="text-gray-600">Send us a message and we'll get back to you based on priority level.</p>
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
                  <option value="booking">Booking & Payment</option>
                  <option value="account">Account & Profile</option>
                  <option value="safety">Safety & Quality</option>
                  <option value="technical">Technical Issues</option>
                  <option value="refund">Refund & Cancellation</option>
                  <option value="service">Service Provider</option>
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

        {/* Additional Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <FileText className="w-12 h-12 mx-auto mb-4 text-brand-600" />
              <h3 className="font-bold mb-2">Customer Guide</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete guide to using Nagrik Sewa services
              </p>
              <Button variant="outline" className="w-full" onClick={handleDownloadGuide}>
                Download Guide
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold mb-2">View All FAQs</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our comprehensive FAQ database
              </p>
              <Button variant="outline" className="w-full" onClick={handleViewAllFAQs}>
                Browse FAQs
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Community Forum</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect with other customers and share tips
              </p>
              <Button variant="outline" className="w-full" onClick={handleJoinForum}>
                Join Forum
              </Button>
            </Card>
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