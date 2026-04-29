import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { indianStates } from "@/data/indianLocations";
import { usePlatformStats } from "@/hooks/use-platform-stats";
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  Zap,
  Heart,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone,
  Brain,
  FileText,
  Navigation,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  Building,
  Activity,
  Blocks
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export default function Index() {
  const { t } = useLanguage();
  const { selectedState, selectedDistrict, setSelectedState, setSelectedDistrict } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { platformStats, loading: statsLoading } = usePlatformStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const navigate = useNavigate();

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/stats/reviews/featured', { params: { limit: 3 } });
      if (response.data.success && response.data.data?.length > 0) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    const redirectTo = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Get current location display text
  const getLocationDisplay = () => {
    const stateData = indianStates.find(s => s.code === selectedState);
    if (selectedDistrict && stateData) {
      return `${selectedDistrict}, ${stateData.name}`;
    } else if (stateData) {
      return stateData.name;
    }
    return "Select Location";
  };

  // Get districts for selected state
  const selectedStateData = indianStates.find(s => s.code === selectedState);
  const districts = selectedStateData?.districts || [];

  const popularServices = [
    { name: t('home.services.houseCleaning'), icon: "🏠", demand: t('home.demands.high') || "High" },
    { name: t('home.services.plumbing'), icon: "🔧", demand: t('home.demands.medium') || "Medium" },
    { name: t('home.services.electricalWork'), icon: "⚡", demand: t('home.demands.high') || "High" },
    { name: t('home.services.painting'), icon: "🎨", demand: t('home.demands.medium') || "Medium" },
    { name: t('home.services.carpentry'), icon: "🔨", demand: t('home.demands.medium') || "Medium" },
    { name: t('home.services.gardening'), icon: "🌱", demand: t('home.demands.low') || "Low" },
  ];

  const features = [
    {
      icon: Brain,
      title: t("home.features.aiMatching.title"),
      description: t("home.features.aiMatching.description"),
      color: "text-blue-600"
    },
    {
      icon: Globe,
      title: t("home.features.multiLanguage.title"),
      description: t("home.features.multiLanguage.description"),
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: t("home.features.verified.title"),
      description: t("home.features.verified.description"),
      color: "text-purple-600"
    },
    {
      icon: Navigation,
      title: t("home.features.tracking.title"),
      description: t("home.features.tracking.description"),
      color: "text-orange-600"
    },
    {
      icon: FileText,
      title: t("home.features.resume.title"),
      description: t("home.features.resume.description"),
      color: "text-indigo-600"
    },
    {
      icon: AlertTriangle,
      title: t("home.features.emergency.title"),
      description: t("home.features.emergency.description"),
      color: "text-red-600"
    }
  ];

  const advancedFeatures = [
    {
      icon: GraduationCap,
      title: t("home.advancedFeatures.training.title"),
      description: t("home.advancedFeatures.training.description"),
    },
    {
      icon: Building,
      title: t("home.advancedFeatures.schemes.title"),
      description: t("home.advancedFeatures.schemes.description"),
    },
    {
      icon: Activity,
      title: t("home.advancedFeatures.analytics.title"),
      description: t("home.advancedFeatures.analytics.description"),
    },
    {
      icon: Users,
      title: t("home.advancedFeatures.community.title"),
      description: t("home.advancedFeatures.community.description"),
    }
  ];

  // Dynamic stats from API
  const stats = [
    { 
      number: platformStats ? `${(platformStats.totalWorkers || 0).toLocaleString()}+` : "Loading...", 
      label: t("home.stats.activeWorkers"), 
      icon: Users 
    },
    { 
      number: platformStats ? `${(platformStats.completedBookings || 0).toLocaleString()}+` : "Loading...", 
      label: t("home.stats.servicesCompleted"), 
      icon: CheckCircle 
    },
    { 
      number: platformStats ? `${platformStats.activeDistricts || 0}+` : "Loading...", 
      label: t("home.stats.citiesCovered"), 
      icon: MapPin 
    },
    { 
      number: "4.8/5", 
      label: t("home.stats.averageRating"), 
      icon: Star 
    },
  ];

  // Default testimonials if none from API
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      _id: '1',
      name: "Verified Customer",
      location: "Delhi",
      rating: 5,
      text: "Found a reliable service within 30 minutes. The worker was verified and did an excellent job!",
      avatar: "V"
    },
    {
      _id: '2',
      name: "Verified Worker",
      location: "Mumbai",
      rating: 5,
      text: "This platform helped me get regular work and build my reputation. The payment system is transparent.",
      avatar: "V"
    },
    {
      _id: '3',
      name: "Verified Customer",
      location: "Bangalore",
      rating: 5,
      text: "The emergency SOS feature saved me when I had a water leak emergency. Got help within 20 minutes!",
      avatar: "V"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Current Location Badge */}
            {(selectedState || selectedDistrict) && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">
                  Showing services in: {getLocationDisplay()}
                </span>
              </div>
            )}
            <Badge className="mb-4 bg-brand-100 text-brand-800 border-brand-200">
              {t('home.heroBadge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('home.heroTitle')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500"> {t('home.heroTitleHighlight')} </span>
              {t('home.heroTitleEnd')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.heroDescription')}
              <span className="font-semibold text-brand-600">{t('home.intelligentChatbot')}</span>,
              <span className="font-semibold text-orange-600"> {t('home.multilingualAI')}</span>, and
              <span className="font-semibold text-purple-600"> {t('home.aiProfiles')}</span> - {t('home.preferredLanguage')}.
            </p>
            <p className="text-lg text-gray-500 mb-6">{t('home.heroSubtitle')}</p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={t('home.searchPlaceholder') || "What service do you need?"}
                      className="pl-10 h-12 text-lg border-gray-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      className="pl-10 h-12 w-full rounded-md border border-gray-300 text-lg bg-white"
                      value={selectedState || ''}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict('');
                      }}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                  {selectedState && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        className="pl-10 h-12 w-full rounded-md border border-gray-300 text-lg bg-white"
                        value={selectedDistrict || ''}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Button 
                    size="lg" 
                    className="h-12 text-lg bg-brand-600 hover:bg-brand-700 shadow-md"
                    onClick={() => {
                      navigate('/workers');
                      // ScrollToTop component will handle scrolling automatically
                    }}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {t('home.findWorkers') || 'Find Workers'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular Services */}
            <div className="mb-12">
              <p className="text-gray-600 mb-4">{t('home.popularServices') || 'Popular services:'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {popularServices.map((service, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="rounded-full border-gray-300 hover:border-brand-400 hover:bg-brand-50"
                    onClick={() => {
                      navigate('/services');
                      // ScrollToTop component will handle scrolling automatically
                    }}
                  >
                    <span className="mr-2">{service.icon}</span>
                    {service.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {service.demand}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-4 shadow-lg"
                onClick={() => {
                  navigate('/join-as-worker');
                  // ScrollToTop component will handle scrolling automatically
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Worker
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-4 shadow-lg"
                onClick={() => {
                  navigate('/join-as-customer');
                  // ScrollToTop component will handle scrolling automatically
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Customer
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-lg px-8 py-4"
                onClick={() => {
                  navigate('/demo');
                  // ScrollToTop component will handle scrolling automatically
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
              {t('home.badges.techBadge')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.featuresTitle') || 'Why Choose Nagrik Sewa?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.featuresSubtitle') || "We're revolutionizing how India connects workers and customers with cutting-edge technology and deep local understanding."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mr-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose a Service</h3>
              <p className="text-gray-600">
                Browse through our wide range of verified home services and select what you need
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book & Schedule</h3>
              <p className="text-gray-600">
                Pick your preferred time slot and confirm your booking instantly
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Service Done</h3>
              <p className="text-gray-600">
                Our verified professionals arrive on time and deliver quality service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              {t('home.badges.futureReady')}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.advancedFeaturesSection.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.advancedFeaturesSection.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t ('What People Say')}
            </h2>
            <p className="text-xl text-gray-600">
              {t ('Trusted by thousands of customers and workers across India')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <Card key={testimonial._id || index} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{testimonial.avatar || testimonial.name?.[0] || 'U'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and workers. Connect instantly and grow your business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/workers">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-gray-50 hover:text-brand-600 hover:shadow-lg text-lg px-8 py-4 font-semibold transition-all duration-300 w-[200px]">
                <Search className="w-5 h-5 mr-2" />
                Find Workers
              </Button>
            </Link>
            <Link to="/find-customers">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-gray-50 hover:text-brand-600 hover:shadow-lg text-lg px-8 py-4 font-semibold transition-all duration-300 w-[200px]">
                <Search className="w-5 h-5 mr-2" />
                Find Customers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
