import { 
  Search, 
  UserCheck, 
  Calendar, 
  Star, 
  Shield,
  MessageCircle,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Users,
  MapPin,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const customerSteps = [
    {
      step: 1,
      icon: Search,
      title: "Search for Services",
      description: "Browse through 50+ service categories or search for the specific service you need. Filter by location, ratings, and availability.",
      color: "bg-blue-500"
    },
    {
      step: 2,
      icon: UserCheck,
      title: "Choose a Verified Professional",
      description: "Review profiles of KYC-verified workers with ratings, reviews, and portfolio. Select the best match for your needs.",
      color: "bg-green-500"
    },
    {
      step: 3,
      icon: Calendar,
      title: "Book & Schedule",
      description: "Pick your preferred date and time slot. Add special instructions and confirm your booking with secure payment.",
      color: "bg-purple-500"
    },
    {
      step: 4,
      icon: Star,
      title: "Get Service & Review",
      description: "Track your professional in real-time. After service completion, rate and review to help the community.",
      color: "bg-orange-500"
    },
  ];

  const workerSteps = [
    {
      step: 1,
      icon: Users,
      title: "Register & Verify",
      description: "Sign up with your details and complete KYC verification through DigiLocker for the verified badge.",
      color: "bg-brand-500"
    },
    {
      step: 2,
      icon: Shield,
      title: "Build Your Profile",
      description: "Create a professional profile with our AI-powered resume builder. Showcase your skills and experience.",
      color: "bg-indigo-500"
    },
    {
      step: 3,
      icon: MapPin,
      title: "Set Your Service Area",
      description: "Define your service areas, availability, and pricing. Reach customers in your locality.",
      color: "bg-teal-500"
    },
    {
      step: 4,
      icon: CreditCard,
      title: "Get Jobs & Earn",
      description: "Receive booking requests, complete services, and get paid securely. Grow your business!",
      color: "bg-emerald-500"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All workers are background checked and KYC verified"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your service provider's arrival in real-time"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options with 100% secure transactions"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Round-the-clock customer support for any assistance"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Nagrik Sewa Works</h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto">
            Connecting customers with verified professionals in just a few simple steps. 
            Experience seamless home services across India.
          </p>
        </div>
      </div>

      {/* For Customers Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              For Customers
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Services in 4 Easy Steps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding and booking trusted home services has never been easier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2 hover:border-brand-200 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
                {index < customerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                Browse Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* For Workers Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              For Service Providers
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Earning in 4 Easy Steps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of skilled professionals already growing their business with Nagrik Sewa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workerSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2 hover:border-green-200 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
                {index < workerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/join-as-worker">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Join as Professional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">Features that make Nagrik Sewa your trusted partner</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white border hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Check out our frequently asked questions or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support-faqs">
              <Button variant="outline" size="lg">
                View FAQs
              </Button>
            </Link>
            <Link to="/support">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
