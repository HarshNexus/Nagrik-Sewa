import { useState } from 'react';
import { 
  HeadphonesIcon, 
  MessageCircle, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  User,
  CreditCard,
  Shield,
  BookOpen
} from "lucide-react";
import { useToast } from '../../hooks/use-toast';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { CONTACT_INFO, makePhoneCall, sendEmail } from "../../constants/contact";

export default function WorkerSupport() {
  const API_BASE_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: '',
    priority: 'medium',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supportSubmitUrl = `${API_BASE_URL}/support/submit`;
      console.log('[WorkerSupport] Calling URL:', supportSubmitUrl);
      const response = await fetch(supportSubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Support Request Submitted!",
          description: "We've received your request and will respond within 24 hours.",
        });
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          category: '',
          priority: 'medium',
          subject: '',
          description: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetHelp = (categoryTitle: string) => {
    const subject = `Support Request - ${categoryTitle}`;
    sendEmail(CONTACT_INFO.WORKER_SUPPORT_EMAIL, subject);
    toast({
      title: "Opening Email",
      description: `Creating email for ${categoryTitle} support...`,
    });
  };

  const supportCategories = [
    {
      id: "technical",
      title: "Technical Support",
      description: "App issues, account problems, payment troubles",
      icon: Shield,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "account",
      title: "Account & Profile",
      description: "Update information, verification issues",
      icon: User,
      color: "bg-green-100 text-green-700"
    },
    {
      id: "payments",
      title: "Payments & Earnings",
      description: "Payment delays, earning disputes, tax documents",
      icon: CreditCard,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "training",
      title: "Training & Certification",
      description: "Course access, certification queries",
      icon: BookOpen,
      color: "bg-orange-100 text-orange-700"
    }
  ];

  const faqs = [
    {
      category: "Account",
      question: "How do I verify my profile?",
      answer: "Complete the verification process by uploading required documents like Aadhaar, PAN card, and skill certificates. Our team reviews within 24-48 hours."
    },
    {
      category: "Payments",
      question: "When will I receive my payment?",
      answer: "Payments are processed weekly on Fridays. Money is transferred to your bank account within 2-3 business days after completion of service."
    },
    {
      category: "Technical",
      question: "Why am I not receiving booking notifications?",
      answer: "Check your notification settings in the app and ensure your phone number is verified. Also check if notifications are enabled in your device settings."
    },
    {
      category: "Training",
      question: "How do I access my certification courses?",
      answer: "Go to the 'Skill Training' section in your worker dashboard. Enrolled courses will appear in 'My Courses' tab."
    },
    {
      category: "Account",
      question: "How do I update my service areas?",
      answer: "Go to your profile settings and select 'Service Areas'. You can add or remove locations where you provide services."
    },
    {
      category: "Payments",
      question: "What if a customer doesn't pay?",
      answer: "Report the issue through the app immediately. We have a payment protection policy for verified workers."
    }
  ];

  const contactMethods = [
    {
      title: "24/7 Helpline",
      description: "Immediate assistance for urgent issues",
      icon: Phone,
      action: () => makePhoneCall(CONTACT_INFO.WORKER_SUPPORT_PHONE),
      label: CONTACT_INFO.WORKER_SUPPORT_PHONE,
      color: "bg-red-50 border-red-200"
    },
    {
      title: "WhatsApp Support",
      description: "Quick responses during business hours",
      icon: MessageCircle,
      action: () => window.open(`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}`, '_blank'),
      label: "Chat on WhatsApp",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Email Support",
      description: "Detailed queries and documentation",
      icon: Mail,
      action: () => sendEmail(CONTACT_INFO.WORKER_SUPPORT_EMAIL),
      label: CONTACT_INFO.WORKER_SUPPORT_EMAIL,
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const supportStats = [
    {
      label: "Average Response Time",
      value: "< 2 minutes",
      icon: Clock
    },
    {
      label: "Issue Resolution Rate",
      value: "98.5%",
      icon: CheckCircle
    },
    {
      label: "Customer Satisfaction",
      value: "4.9/5",
      icon: HeadphonesIcon
    }
  ];

  const emergencyContacts = [
    {
      title: "24/7 Support Helpline",
      number: CONTACT_INFO.MAIN_SUPPORT_PHONE,
      description: "For urgent work-related issues",
      color: "bg-red-600"
    },
    {
      title: "Police Helpline",
      number: "100",
      description: "For security and safety issues",
      color: "bg-blue-600"
    },
    {
      title: "Women's Helpline",
      number: "1091",
      description: "For women workers in distress",
      color: "bg-purple-600"
    }
  ];

  const handleViewAllFAQs = () => {
    // Navigate to dedicated FAQ page or open FAQ modal
    window.open('/support/faqs', '_blank');
    toast({
      title: "Opening FAQs",
      description: "View all frequently asked questions",
    });
  };

  const handleDownloadHandbook = () => {
    // In production, this would link to actual PDF
    window.open('/documents/worker-handbook.pdf', '_blank');
    toast({
      title: "Downloading Handbook",
      description: "Worker handbook will download shortly",
    });
  };

  const handleWatchVideos = () => {
    // Open training videos page or YouTube playlist
    window.open('https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID', '_blank');
    toast({
      title: "Opening Training Videos",
      description: "Watch tutorials to learn more",
    });
  };

  const handleJoinForum = () => {
    // Open community forum (could be Discord, Forum page, etc.)
    window.open('/community/forum', '_blank');
    toast({
      title: "Opening Community Forum",
      description: "Connect with other workers",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HeadphonesIcon className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Worker Support Center</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              We're here to help you succeed. Get instant support, resources, and guidance for all your work-related needs.
            </p>
          </div>
        </div>
      </div>

      {/* Support Stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportStats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <stat.icon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Quick Contact Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Get Help Now</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className={`p-6 border-2 ${method.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                  <div onClick={method.action}>
                    <method.icon className="w-10 h-10 text-brand-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    <Button className="w-full" size="sm">
                      {method.label}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Support Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {supportCategories.map((category) => (
                <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGetHelp(category.title)}
                      >
                        Get Help
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Submit a Support Request</h2>
            <p className="text-xl text-gray-600">Can't find what you're looking for? Send us a detailed message.</p>
          </div>

          <Card className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <Input 
                    type="text" 
                    name="fullName"
                    placeholder="Your full name" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <Input 
                    type="tel" 
                    name="phone"
                    placeholder="Your phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <Input 
                  type="email" 
                  name="email"
                  placeholder="your.email@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Issue affecting work</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <Input 
                  type="text" 
                  name="subject"
                  placeholder="Brief description of your issue" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <Textarea 
                  name="description"
                  placeholder="Please provide as much detail as possible about your issue..."
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                <Input type="file" multiple />
                <p className="text-xs text-gray-500 mt-1">Upload screenshots or documents that might help us understand your issue</p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start mb-3">
                  <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2 py-1 rounded mr-3">
                    {faq.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewAllFAQs}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-red-900">Emergency Contacts</h2>
            <p className="text-xl text-red-700">For immediate assistance in emergency situations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-6 border-2 border-red-200">
                <div className="text-center">
                  <div className={`${contact.color} text-white p-4 rounded-lg inline-block mb-4`}>
                    <Phone className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{contact.number}</div>
                  <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                  <Button 
                    className={contact.color}
                    onClick={() => makePhoneCall(contact.number)}
                    size="sm"
                  >
                    Call Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-xl text-gray-600">Tools and guides to help you succeed</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Worker Handbook</h3>
              <p className="text-gray-600 text-sm mb-4">Complete guide to using the platform effectively</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadHandbook}
              >
                Download PDF
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Training Videos</h3>
              <p className="text-gray-600 text-sm mb-4">Video tutorials on app usage and best practices</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleWatchVideos}
              >
                Watch Now
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Community Forum</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with other workers and share experiences</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleJoinForum}
              >
                Join Forum
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
