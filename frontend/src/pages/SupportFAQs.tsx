import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";
import { CONTACT_INFO, makePhoneCall, sendEmail } from "@/constants/contact";

export default function SupportFAQs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = ["All", "Account", "Payments", "Technical", "Training", "Bookings", "Safety"];

  const allFaqs = [
    // Account FAQs
    {
      id: 1,
      category: "Account",
      question: "How do I verify my profile?",
      answer: "Complete the verification process by uploading required documents like Aadhaar, PAN card, and skill certificates. Our team reviews within 24-48 hours. You can upload documents from your profile settings under 'Verification' section."
    },
    {
      id: 2,
      category: "Account",
      question: "How do I update my service areas?",
      answer: "Go to your profile settings and select 'Service Areas'. You can add or remove locations where you provide services. Make sure to save changes after updating."
    },
    {
      id: 3,
      category: "Account",
      question: "Can I change my phone number?",
      answer: "Yes, go to Settings > Account > Phone Number. You'll need to verify the new number via OTP before the change takes effect."
    },
    {
      id: 4,
      category: "Account",
      question: "How do I deactivate my account?",
      answer: "Contact our support team to deactivate your account. Note that this action may take 24-48 hours and any pending bookings must be completed first."
    },

    // Payment FAQs
    {
      id: 5,
      category: "Payments",
      question: "When will I receive my payment?",
      answer: "Payments are processed weekly on Fridays. Money is transferred to your bank account within 2-3 business days after completion of service and customer confirmation."
    },
    {
      id: 6,
      category: "Payments",
      question: "What if a customer doesn't pay?",
      answer: "Report the issue through the app immediately. We have a payment protection policy for verified workers. Our team will investigate and ensure you receive payment within 5-7 business days."
    },
    {
      id: 7,
      category: "Payments",
      question: "How do I update my bank account details?",
      answer: "Go to Settings > Payments > Bank Account. You'll need to verify the new account with a small test deposit before it becomes active."
    },
    {
      id: 8,
      category: "Payments",
      question: "Are there any commission charges?",
      answer: "Nagrik Sewa charges a 15% service fee on each booking. This covers platform maintenance, customer support, and payment processing."
    },
    {
      id: 9,
      category: "Payments",
      question: "Can I get advance payment?",
      answer: "For verified workers with good ratings, advance payment options are available for bookings above ₹5,000. Contact support to enable this feature."
    },

    // Technical FAQs
    {
      id: 10,
      category: "Technical",
      question: "Why am I not receiving booking notifications?",
      answer: "Check your notification settings in the app and ensure your phone number is verified. Also check if notifications are enabled in your device settings. Try logging out and logging back in."
    },
    {
      id: 11,
      category: "Technical",
      question: "The app is running slowly, what should I do?",
      answer: "Clear app cache from Settings > Storage > Clear Cache. Ensure you have the latest app version installed. If issues persist, try reinstalling the app."
    },
    {
      id: 12,
      category: "Technical",
      question: "I forgot my password, how do I reset it?",
      answer: "On the login screen, click 'Forgot Password'. Enter your registered phone number or email, and follow the OTP verification process to set a new password."
    },
    {
      id: 13,
      category: "Technical",
      question: "Can I use the app on multiple devices?",
      answer: "Yes, you can log in on multiple devices with the same account. However, only one active session is allowed at a time for security reasons."
    },

    // Training FAQs
    {
      id: 14,
      category: "Training",
      question: "How do I access my certification courses?",
      answer: "Go to the 'Skill Training' section in your worker dashboard. Enrolled courses will appear in 'My Courses' tab. You can start learning immediately after enrollment."
    },
    {
      id: 15,
      category: "Training",
      question: "Are the training courses free?",
      answer: "Basic skill courses are free for all verified workers. Advanced certification programs may have a nominal fee, but discounts are available for active workers."
    },
    {
      id: 16,
      category: "Training",
      question: "How long do I have to complete a course?",
      answer: "Most courses have a 90-day completion period from enrollment date. You can learn at your own pace during this time."
    },
    {
      id: 17,
      category: "Training",
      question: "Will I get a certificate after completion?",
      answer: "Yes, you'll receive a digital certificate upon successful completion of the course and passing the final assessment with 70% or higher score."
    },

    // Bookings FAQs
    {
      id: 18,
      category: "Bookings",
      question: "How do I accept a booking request?",
      answer: "When you receive a booking notification, tap on it to view details. Review the work requirements, location, and payment. If interested, tap 'Accept Booking' within the time limit."
    },
    {
      id: 19,
      category: "Bookings",
      question: "Can I cancel a confirmed booking?",
      answer: "Yes, but frequent cancellations affect your rating. Go to 'My Bookings', select the booking, and choose 'Cancel'. Provide a valid reason. Cancellations within 2 hours of start time may incur penalties."
    },
    {
      id: 20,
      category: "Bookings",
      question: "How do I mark a booking as complete?",
      answer: "After completing the work, open the booking and tap 'Mark Complete'. The customer will be notified to confirm completion and leave a review."
    },
    {
      id: 21,
      category: "Bookings",
      question: "What if the customer isn't available at the scheduled time?",
      answer: "Wait for 15 minutes and try calling the customer. If they don't respond, mark the booking as 'Customer Not Available'. You'll still receive a cancellation fee."
    },

    // Safety FAQs
    {
      id: 22,
      category: "Safety",
      question: "What safety measures should I follow?",
      answer: "Always verify customer identity, share your location with family, carry proper ID, avoid accepting cash in secluded areas, and report any suspicious behavior immediately."
    },
    {
      id: 23,
      category: "Safety",
      question: "What should I do in case of harassment?",
      answer: "Report immediately through the app's 'Report Issue' feature or call our safety helpline at 112. We have zero tolerance for harassment and will take immediate action."
    },
    {
      id: 24,
      category: "Safety",
      question: "Are there any insurance benefits?",
      answer: "All verified workers are covered under our basic insurance policy for work-related injuries. Premium insurance with higher coverage is available for ₹99/month."
    },
    {
      id: 25,
      category: "Safety",
      question: "Can I block a customer?",
      answer: "Yes, go to the completed booking, tap on customer profile, and select 'Block Customer'. You won't receive booking requests from them in the future."
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions about Nagrik Sewa platform
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for questions..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    selectedCategory === category
                      ? "bg-brand-600 text-white"
                      : "hover:bg-brand-50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4 mb-12">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <Card
                  key={faq.id}
                  className="p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        {faq.question}
                      </h3>
                      {expandedFaq === faq.id && (
                        <p className="text-gray-600 leading-relaxed mt-3">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Contact Support */}
          <Card className="p-8 bg-brand-50 border-brand-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Still Need Help?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to assist you.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => makePhoneCall(CONTACT_INFO.WORKER_SUPPORT_PHONE)}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{CONTACT_INFO.WORKER_SUPPORT_PHONE}</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.open(`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER}`, '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">WhatsApp Support</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => sendEmail(CONTACT_INFO.WORKER_SUPPORT_EMAIL)}
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">Email Support</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
