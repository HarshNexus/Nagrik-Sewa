import { 
  Building, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  BarChart,
  CreditCard,
  Headphones,
  CheckCircle,
  ArrowRight,
  FileText,
  Settings,
  Globe,
  Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { usePlatformStats } from "@/hooks/use-platform-stats";

export default function ForBusinesses() {
  const { platformStats } = usePlatformStats();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    employees: "",
    message: ""
  });

  const benefits = [
    {
      icon: Users,
      title: "Verified Workforce",
      description: "Access to 50,000+ KYC-verified professionals across 50+ service categories."
    },
    {
      icon: Clock,
      title: "On-Demand Services",
      description: "Book services instantly or schedule in advance based on your business needs."
    },
    {
      icon: CreditCard,
      title: "Centralized Billing",
      description: "Single invoice for all services with detailed reporting and expense tracking."
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Service level agreements with satisfaction guarantee and dedicated support."
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Track usage, costs, and performance with comprehensive business analytics."
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Priority customer support with a dedicated account manager for your business."
    },
  ];

  const services = [
    {
      title: "Office Maintenance",
      items: ["Cleaning", "Electrical", "Plumbing", "AC Service", "Pest Control"]
    },
    {
      title: "Facility Management",
      items: ["Security", "Gardening", "Waste Management", "Sanitization"]
    },
    {
      title: "IT & Technical",
      items: ["Computer Repair", "Network Setup", "CCTV Installation", "Intercom Systems"]
    },
    {
      title: "Specialized Services",
      items: ["Deep Cleaning", "Renovation", "Interior Design", "Event Setup"]
    },
  ];

  const plans = [
    {
      name: "Starter",
      description: "For small businesses",
      price: "₹9,999",
      period: "/month",
      features: [
        "Up to 20 service bookings/month",
        "Email support",
        "Basic analytics",
        "Single location"
      ],
      popular: false
    },
    {
      name: "Business",
      description: "For growing companies",
      price: "₹24,999",
      period: "/month",
      features: [
        "Up to 100 service bookings/month",
        "Priority support",
        "Advanced analytics",
        "Up to 5 locations",
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "Custom",
      period: "",
      features: [
        "Unlimited bookings",
        "24/7 priority support",
        "Custom integrations",
        "Unlimited locations",
        "Dedicated team",
        "SLA guarantees"
      ],
      popular: false
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert("Thank you! Our team will contact you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                For Businesses
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Services for Your Business
              </h1>
              <p className="text-xl text-brand-100 mb-8">
                Streamline facility management with verified professionals. 
                One platform for all your business service needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-3xl font-bold">500+</p>
                    <p className="text-sm text-brand-200">Business Clients</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-3xl font-bold">50K+</p>
                    <p className="text-sm text-brand-200">Services Delivered</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-3xl font-bold">98%</p>
                    <p className="text-sm text-brand-200">Satisfaction Rate</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-3xl font-bold">24/7</p>
                    <p className="text-sm text-brand-200">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Businesses Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage facility services efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-brand-200 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive business services to keep your facilities running smoothly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border">
                <h3 className="font-semibold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a plan that fits your business needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-brand-500 shadow-lg' : 'border'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-600">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-brand-600 hover:bg-brand-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600">
                Fill out the form and our team will contact you within 24 hours.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input 
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <Input 
                    placeholder="Your name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input 
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input 
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                <select 
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.employees}
                  onChange={(e) => setFormData({...formData, employees: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea 
                  placeholder="Tell us about your business needs..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" size="lg">
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
