import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  MapPin, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  Star,
  Building,
  Handshake
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlatformStats } from "@/hooks/use-platform-stats";

export default function About() {
  const { t } = useLanguage();
  const { platformStats, loading: statsLoading } = usePlatformStats();

  const stats = [
    { number: platformStats.totalWorkers.toLocaleString() + "+", label: "Active Workers", icon: Users },
    { number: platformStats.completedBookings.toLocaleString() + "+", label: "Services Completed", icon: CheckCircle },
    { number: platformStats.activeDistricts + "+", label: "Districts Covered", icon: MapPin },
    { number: platformStats.averageRating + "/5", label: "Average Rating", icon: Star },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every service provider is background verified and KYC compliant through DigiLocker integration."
    },
    {
      icon: Heart,
      title: "Empowerment",
      description: "We empower local workers with digital tools, skill training, and access to a wider customer base."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "AI-powered matching, multi-language support, and real-time tracking for seamless experiences."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Available in 13+ Indian languages, making professional services accessible to all."
    },
  ];

  const team = [
    {
      name: "Mission",
      icon: Target,
      description: "To bridge the gap between skilled workers and customers across India, creating economic opportunities while ensuring quality service delivery."
    },
    {
      name: "Vision",
      icon: Building,
      description: "To become India's most trusted platform for home services, empowering millions of workers and serving every household."
    },
    {
      name: "Values",
      icon: Handshake,
      description: "Integrity, inclusivity, innovation, and impact drive everything we do at Nagrik Sewa."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-3xl">न</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Nagrik Sewa</h1>
            <p className="text-xl text-brand-100 max-w-3xl mx-auto">
              India's first AI-powered home services platform bridging the gap between skilled workers and customers. 
              Empowering workers with digital tools while providing customers with verified professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Nagrik Sewa was born from a simple observation: millions of skilled workers across India 
                  struggle to find consistent work, while customers often struggle to find reliable, verified 
                  service providers.
                </p>
                <p>
                  We set out to solve this problem by creating a platform that not only connects workers with 
                  customers but also empowers workers with the tools they need to succeed in the digital economy—
                  from AI-generated professional profiles to skill training programs.
                </p>
                <p>
                  Today, we serve 640+ districts across India, supporting workers in 50+ service categories, 
                  all while maintaining the highest standards of verification and quality assurance.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8">
              <div className="space-y-6">
                {team.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide every decision we make and every feature we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-brand-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Nagrik Sewa?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Verified Professionals</h3>
              <p className="text-gray-600">
                Every worker undergoes rigorous background checks and KYC verification through DigiLocker.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">13+ Indian Languages</h3>
              <p className="text-gray-600">
                Use the platform in your preferred language—Hindi, Tamil, Bengali, and 10 more.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Satisfaction guaranteed or your money back. We stand behind every service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Nagrik Sewa Community
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Whether you're looking for professional services or want to offer your skills, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/join-as-customer" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
            >
              Find Services
            </a>
            <a 
              href="/join-as-worker" 
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors border border-brand-500"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
