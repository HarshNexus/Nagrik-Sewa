import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Award, 
  Video, 
  Users, 
  Clock, 
  CheckCircle,
  Star,
  Play,
  Download,
  FileText,
  TrendingUp,
  Target,
  Zap,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

interface SkillCourse {
  _id?: string;
  id: number;
  title: string;
  category: string;
  icon: string;
  description: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  instructor: string;
  videoUrl: string;
  thumbnail: string;
  modules: string[];
  certificationAvailable: boolean;
  price: string;
}

export default function SkillTraining() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillCourses, setSkillCourses] = useState<SkillCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      if (response.data.success && response.data.data.length > 0) {
        setSkillCourses(response.data.data);
      } else {
        // Set empty array if no courses
        setSkillCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Info',
        description: 'No courses available at the moment. Check back soon!',
      });
      setSkillCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Home Services", "Construction", "Technical", "Personal Care", "Safety"];

  const benefits = [
    {
      icon: Award,
      title: "Industry-Recognized Certificates",
      description: "Get certificates that are valued by customers and employers"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from experienced professionals with real-world expertise"
    },
    {
      icon: Video,
      title: "Video-Based Learning",
      description: "High-quality video content with practical demonstrations"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with lifetime access to content"
    },
    {
      icon: TrendingUp,
      title: "Skill Upgradation",
      description: "Continuous learning opportunities to advance your career"
    },
    {
      icon: Target,
      title: "Job Placement Support",
      description: "Get priority placement on our platform after certification"
    }
  ];

  const filteredCourses = skillCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWatchVideo = (course: any) => {
    if (course.videoUrl) {
      window.open(course.videoUrl, '_blank');
    } else {
      alert(`Video for "${course.title}" will be available soon. Please check back later!`);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Skill Training Center</h1>
          </div>
        </div>
      </div>

      {/* Training Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Training Programs</h2>
            <p className="text-xl text-gray-600">Choose from our wide range of skill development courses</p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search training courses..."
                    className="pl-10 h-12 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="h-12 px-4 rounded-md border border-gray-300 text-lg bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCourses.length} Training Courses Available
            </h2>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{course.icon}</span>
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{course.students} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                      {course.level}
                    </Badge>
                    <div className="font-semibold text-lg text-gray-900">{course.price}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Instructor:</div>
                    <div className="text-sm text-gray-600">{course.instructor}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Course Modules:</div>
                    <div className="space-y-1">
                      {course.modules.slice(0, 3).map((module, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{module}</span>
                        </div>
                      ))}
                      {course.modules.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{course.modules.length - 3} more modules
                        </div>
                      )}
                    </div>
                  </div>

                  {course.certificationAvailable && (
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Certificate Available</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleWatchVideo(course)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Training Video
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Full Curriculum
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-gray-600">Training Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">7,000+</div>
              <div className="text-gray-600">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-gray-600">Certification Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Training Programs?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get certified, improve your skills, and increase your earning potential with our comprehensive training courses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Training</h3>
              <p className="text-gray-600">Get industry-recognized certificates upon course completion</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from experienced professionals with years of industry experience</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Offline Access</h3>
              <p className="text-gray-600">Download videos and materials for offline learning at your own pace</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Upgrade Your Skills?</h2>
          <p className="text-xl text-brand-100 mb-8">
            Join thousands of successful service providers who have advanced their careers through our training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
              Browse All Courses
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600">
              Download Training Catalog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
