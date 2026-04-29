import { useState, useEffect } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Heart,
  MapPin,
  Clock,
  Award,
  Zap,
  Globe,
  Code,
  Headphones,
  BarChart,
  Rocket,
  Coffee,
  GraduationCap,
  Building,
  RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { usePlatformStats } from "@/hooks/use-platform-stats";

interface JobOpening {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
}

export default function Careers() {
  const { platformStats } = usePlatformStats();
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/careers/openings');
      if (response.data.success && response.data.data?.length > 0) {
        setOpenings(response.data.data);
      } else {
        // Set empty to show "no openings" message
        setOpenings([]);
      }
    } catch (error) {
      console.error('Error fetching job openings:', error);
      // Fallback to empty for now
      setOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family, mental health support, and wellness programs."
    },
    {
      icon: TrendingUp,
      title: "Growth & Learning",
      description: "Learning budget, mentorship programs, and clear career progression paths."
    },
    {
      icon: Clock,
      title: "Flexible Work",
      description: "Hybrid work options, flexible hours, and generous paid time off."
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Performance bonuses, stock options, and regular recognition for great work."
    },
    {
      icon: Coffee,
      title: "Great Culture",
      description: "Fun team events, inclusive environment, and a mission that matters."
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Access to courses, conferences, and certifications to advance your career."
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "Every decision starts with how it impacts our users—both customers and workers."
    },
    {
      icon: Zap,
      title: "Move Fast",
      description: "We ship quickly, learn from feedback, and iterate to deliver impact."
    },
    {
      icon: Globe,
      title: "Think Big",
      description: "We're building for 640+ districts and millions of users across India."
    },
    {
      icon: Heart,
      title: "Care Deeply",
      description: "We genuinely care about empowering workers and serving communities."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            We're Hiring!
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto mb-8">
            Help us empower millions of workers and transform home services across India. 
            Build technology that makes a real difference in people's lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Building className="w-5 h-5" />
              <span>640+ Districts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <span>50,000+ Workers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Rocket className="w-5 h-5" />
              <span>Fast Growing</span>
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
              These principles guide how we work together and build our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your next opportunity and help us build the future of home services.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-brand-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading job openings...</p>
            </div>
          ) : openings.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No openings at the moment</h3>
              <p className="text-gray-500 mb-6">Check back soon for new opportunities!</p>
              <Button className="bg-brand-600 hover:bg-brand-700">
                Send Your Resume Anyway
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {openings.map((job, index) => (
                <Card key={job._id || index} className="hover:shadow-lg transition-shadow border-2 hover:border-brand-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-brand-600 font-medium">{job.department}</p>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer competitive benefits and a great work environment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-brand-600 to-brand-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-brand-100 mb-8 text-lg">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
            Send Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
