import { useState } from "react";
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Phone,
  Mail,
  MapPin,
  Star,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Save,
  Sparkles
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { AIResumeEnhancer } from "../../components/resume/AIResumeEnhancer";

export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState("personal");
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      summary: ""
    },
    experience: [
      {
        id: 1,
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      }
    ],
    education: [
      {
        id: 1,
        degree: "",
        institution: "",
        year: "",
        grade: ""
      }
    ],
    skills: [
      {
        id: 1,
        skillName: "",
        level: "Beginner"
      }
    ],
    certifications: [
      {
        id: 1,
        name: "",
        issuer: "",
        date: "",
        credentialId: ""
      }
    ],
    languages: [
      {
        id: 1,
        language: "",
        proficiency: "Basic"
      }
    ]
  });

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Star },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "languages", label: "Languages", icon: FileText },
    { id: "ai-enhance", label: "AI Enhancement", icon: Sparkles }
  ];

  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and modern design suitable for all industries",
      preview: "/api/placeholder/300/400",
      popular: true
    },
    {
      id: 2,
      name: "Creative",
      description: "Colorful design perfect for creative professionals",
      preview: "/api/placeholder/300/400",
      popular: false
    },
    {
      id: 3,
      name: "Minimal",
      description: "Simple and elegant layout focusing on content",
      preview: "/api/placeholder/300/400",
      popular: true
    },
    {
      id: 4,
      name: "Modern",
      description: "Contemporary design with visual elements",
      preview: "/api/placeholder/300/400",
      popular: false
    }
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (section: string, index: number, field: string, value: string | boolean) => {
    if (section === "experience") {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === "education") {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === "skills") {
      setResumeData(prev => ({
        ...prev,
        skills: prev.skills.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === "certifications") {
      setResumeData(prev => ({
        ...prev,
        certifications: prev.certifications.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === "languages") {
      setResumeData(prev => ({
        ...prev,
        languages: prev.languages.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const addArrayItem = (section: string) => {
    const newItem = {
      id: Date.now(),
      ...(section === "experience" && {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      }),
      ...(section === "education" && {
        degree: "",
        institution: "",
        year: "",
        grade: ""
      }),
      ...(section === "skills" && {
        skillName: "",
        level: "Beginner"
      }),
      ...(section === "certifications" && {
        name: "",
        issuer: "",
        date: "",
        credentialId: ""
      }),
      ...(section === "languages" && {
        language: "",
        proficiency: "Basic"
      })
    };

    if (section === "experience") {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, newItem as any]
      }));
    } else if (section === "education") {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, newItem as any]
      }));
    } else if (section === "skills") {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newItem as any]
      }));
    } else if (section === "certifications") {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newItem as any]
      }));
    } else if (section === "languages") {
      setResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, newItem as any]
      }));
    }
  };

  const removeArrayItem = (section: string, index: number) => {
    if (section === "experience") {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }));
    } else if (section === "education") {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    } else if (section === "skills") {
      setResumeData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    } else if (section === "certifications") {
      setResumeData(prev => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index)
      }));
    } else if (section === "languages") {
      setResumeData(prev => ({
        ...prev,
        languages: prev.languages.filter((_, i) => i !== index)
      }));
    }
  };

  const renderPersonalSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <Input
            type="text"
            value={resumeData.personal.fullName}
            onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <Input
            type="tel"
            value={resumeData.personal.phone}
            onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <Input
            type="email"
            value={resumeData.personal.email}
            onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <Input
            type="text"
            value={resumeData.personal.city}
            onChange={(e) => handleInputChange('personal', 'city', e.target.value)}
            placeholder="Your city"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <Input
            type="text"
            value={resumeData.personal.address}
            onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
            placeholder="Complete address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
          <Textarea
            value={resumeData.personal.summary}
            onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
            placeholder="Brief description of your skills and experience..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Work Experience</h3>
        <Button onClick={() => addArrayItem('experience')} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <Card key={exp.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Experience {index + 1}</h4>
            {resumeData.experience.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeArrayItem('experience', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <Input
                type="text"
                value={exp.jobTitle}
                onChange={(e) => handleArrayInputChange('experience', index, 'jobTitle', e.target.value)}
                placeholder="e.g., Plumber, Electrician, Cleaner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company/Employer</label>
              <Input
                type="text"
                value={exp.company}
                onChange={(e) => handleArrayInputChange('experience', index, 'company', e.target.value)}
                placeholder="Company name or Self-employed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => handleArrayInputChange('experience', index, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => handleArrayInputChange('experience', index, 'endDate', e.target.value)}
                disabled={exp.current}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={exp.current}
                  onChange={(e) => handleArrayInputChange('experience', index, 'current', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`current-${index}`} className="text-sm text-gray-700">Currently working here</label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={exp.description}
                onChange={(e) => handleArrayInputChange('experience', index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Skills</h3>
        <Button onClick={() => addArrayItem('skills')} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {resumeData.skills.map((skill, index) => (
          <Card key={skill.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Skill {index + 1}</h4>
              {resumeData.skills.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeArrayItem('skills', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                <Input
                  type="text"
                  value={skill.skillName}
                  onChange={(e) => handleArrayInputChange('skills', index, 'skillName', e.target.value)}
                  placeholder="e.g., Plumbing, Electrical, Cleaning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                <select
                  value={skill.level}
                  onChange={(e) => handleArrayInputChange('skills', index, 'level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalSection();
      case "experience":
        return renderExperienceSection();
      case "skills":
        return renderSkillsSection();
      case "ai-enhance":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">AI Resume Enhancement</h3>
            <AIResumeEnhancer 
              resumeData={resumeData}
              onResumeUpdate={setResumeData}
            />
          </div>
        );
      // Add other sections as needed
      default:
        return <div>Section content coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Resume Builder</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Create a professional resume that highlights your skills and experience. Stand out to customers and employers with our easy-to-use resume builder.
            </p>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose a Template</h2>
            <p className="text-xl text-gray-600">Professional resume templates designed for service providers</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-64 object-cover"
                  />
                  {template.popular && (
                    <div className="absolute top-4 right-4 bg-brand-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <Button className="w-full" size="sm">
                    Use This Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Builder */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resume Sections</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id 
                          ? 'bg-brand-600 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <section.icon className="w-5 h-5 mr-3" />
                      {section.label}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 space-y-3">
                  <Button className="w-full" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Resume
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                {renderSection()}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Resume Writing Tips</h2>
            <p className="text-xl text-gray-600">Make your resume stand out with these professional tips</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <Edit className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Keep it Concise</h3>
              <p className="text-gray-600 text-sm">
                Limit your resume to 1-2 pages. Focus on relevant experience and skills that match the job requirements.
              </p>
            </Card>
            
            <Card className="p-6">
              <Star className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Highlight Achievements</h3>
              <p className="text-gray-600 text-sm">
                Use specific examples and numbers to showcase your accomplishments and the value you've provided.
              </p>
            </Card>
            
            <Card className="p-6">
              <Award className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Include Certifications</h3>
              <p className="text-gray-600 text-sm">
                Add any relevant certifications, training, or licenses that demonstrate your professional qualifications.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
