import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Download,
  Eye,
  Save,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Upload,
  Printer
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { AIResumeEnhancer } from '../components/resume/AIResumeEnhancer';
import { useToast } from '../hooks/use-toast';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
  nationality: string;
  profileSummary: string;
  photo?: string;
}

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
  skills: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  percentage: string;
  grade: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Certification';
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
}

interface ResumeData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certificates: Certificate[];
  languages: string[];
  hobbies: string[];
  references: string;
}

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');
  
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: user?.firstName + ' ' + user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      dateOfBirth: '',
      nationality: 'Indian',
      profileSummary: '',
    },
    experience: [],
    education: [],
    skills: [],
    certificates: [],
    languages: ['Hindi', 'English'],
    hobbies: [],
    references: 'Available upon request'
  });
  
  const [showAIEnhancer, setShowAIEnhancer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Save resume data to localStorage
  const saveResume = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`resume_${user?._id}`, JSON.stringify(resumeData));
      
      // Also save to backend if user is authenticated
      if (user) {
        const resumeSaveUrl = `${API_BASE_URL}/resume/save`;
        console.log('[ResumeBuilder] Calling URL:', resumeSaveUrl);
        const response = await fetch(resumeSaveUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resumeData)
        });
        
        if (response.ok) {
          toast({
            title: "Resume Saved",
            description: "Your resume has been saved successfully.",
          });
        }
      } else {
        toast({
          title: "Resume Saved Locally",
          description: "Your resume has been saved to your browser storage.",
        });
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save resume. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load resume data on component mount
  useEffect(() => {
    const loadResume = async () => {
      try {
        // Try to load from backend first
        if (user) {
          const resumeGetUrl = `${API_BASE_URL}/resume/get`;
          console.log('[ResumeBuilder] Calling URL:', resumeGetUrl);
          const response = await fetch(resumeGetUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.resume) {
              setResumeData(data.resume);
              return;
            }
          }
        }
        
        // Fallback to localStorage
        const localData = localStorage.getItem(`resume_${user?._id}`);
        if (localData) {
          setResumeData(JSON.parse(localData));
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    };

    loadResume();
  }, [user]);

  // Helper functions for managing array fields
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      skills: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      percentage: '',
      grade: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Beginner',
      category: 'Technical'
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addCertificate = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
    };
    setResumeData(prev => ({
      ...prev,
      certificates: [...prev.certificates, newCert]
    }));
  };

  const updateCertificate = (id: string, field: keyof Certificate, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertificate = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
  };

  const exportToPDF = () => {
    // This would integrate with a PDF generation library
    toast({
      title: "PDF Export",
      description: "PDF generation feature coming soon!",
    });
  };

  const previewResume = () => {
    // Open preview modal or navigate to preview page
    navigate('/resume/preview');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="mt-2 text-gray-600">
                Create a professional resume with AI assistance
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAIEnhancer(true)}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Enhance
              </Button>
              <Button
                variant="outline"
                onClick={previewResume}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={exportToPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button
                onClick={saveResume}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Resume Completion</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === 'personal' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('personal')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </Button>
                <Button
                  variant={activeTab === 'experience' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('experience')}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </Button>
                <Button
                  variant={activeTab === 'education' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('education')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </Button>
                <Button
                  variant={activeTab === 'skills' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('skills')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Skills
                </Button>
                <Button
                  variant={activeTab === 'certificates' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('certificates')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Certificates
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={resumeData.personal.fullName}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, fullName: e.target.value }
                            }))}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personal.email}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, email: e.target.value }
                            }))}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={resumeData.personal.phone}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, phone: e.target.value }
                            }))}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={resumeData.personal.dateOfBirth}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, dateOfBirth: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={resumeData.personal.address}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, address: e.target.value }
                            }))}
                            placeholder="Enter your complete address"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={resumeData.personal.city}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, city: e.target.value }
                            }))}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={resumeData.personal.state}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, state: e.target.value }
                            }))}
                            placeholder="State"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="profileSummary">Professional Summary</Label>
                          <Textarea
                            id="profileSummary"
                            value={resumeData.personal.profileSummary}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, profileSummary: e.target.value }
                            }))}
                            placeholder="Write a brief professional summary highlighting your key skills and experience..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Work Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Work Experience</h2>
                      <Button onClick={addExperience} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                    
                    {resumeData.experience.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No work experience added yet.</p>
                        <p className="text-sm">Click "Add Experience" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {resumeData.experience.map((exp, index) => (
                          <Card key={exp.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Experience #{index + 1}</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(exp.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Job Title *</Label>
                                  <Input
                                    value={exp.jobTitle}
                                    onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                    placeholder="Software Developer"
                                  />
                                </div>
                                <div>
                                  <Label>Company *</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Company Name"
                                  />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input
                                    value={exp.location}
                                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                    placeholder="City, State"
                                  />
                                </div>
                                <div>
                                  <Label>Start Date</Label>
                                  <Input
                                    type="date"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>End Date</Label>
                                  <Input
                                    type="date"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    disabled={exp.isCurrentJob}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`current-${exp.id}`}
                                    checked={exp.isCurrentJob}
                                    onChange={(e) => updateExperience(exp.id, 'isCurrentJob', e.target.checked)}
                                  />
                                  <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Job Description</Label>
                                  <Textarea
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                    placeholder="Describe your responsibilities and achievements..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Education</h2>
                      <Button onClick={addEducation} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Education
                      </Button>
                    </div>
                    
                    {resumeData.education.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No education details added yet.</p>
                        <p className="text-sm">Click "Add Education" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {resumeData.education.map((edu, index) => (
                          <Card key={edu.id} className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Education #{index + 1}</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEducation(edu.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Degree/Course *</Label>
                                  <Input
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    placeholder="Bachelor of Technology"
                                  />
                                </div>
                                <div>
                                  <Label>Institution *</Label>
                                  <Input
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    placeholder="University/College Name"
                                  />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input
                                    value={edu.location}
                                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                    placeholder="City, State"
                                  />
                                </div>
                                <div>
                                  <Label>Start Year</Label>
                                  <Input
                                    value={edu.startYear}
                                    onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                                    placeholder="2020"
                                  />
                                </div>
                                <div>
                                  <Label>End Year</Label>
                                  <Input
                                    value={edu.endYear}
                                    onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                                    placeholder="2024"
                                  />
                                </div>
                                <div>
                                  <Label>Grade/Percentage</Label>
                                  <Input
                                    value={edu.percentage}
                                    onChange={(e) => updateEducation(edu.id, 'percentage', e.target.value)}
                                    placeholder="85% or 8.5 CGPA"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Skills & Competencies</h2>
                      <Button onClick={addSkill} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>
                    
                    {resumeData.skills.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No skills added yet.</p>
                        <p className="text-sm">Click "Add Skill" to get started.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resumeData.skills.map((skill) => (
                          <Card key={skill.id} className="border-l-4 border-l-purple-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">{skill.category}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSkill(skill.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <Label>Skill Name</Label>
                                  <Input
                                    value={skill.name}
                                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                    placeholder="JavaScript, Communication, etc."
                                  />
                                </div>
                                <div>
                                  <Label>Category</Label>
                                  <Select
                                    value={skill.category}
                                    onValueChange={(value) => updateSkill(skill.id, 'category', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Technical">Technical</SelectItem>
                                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                                      <SelectItem value="Languages">Languages</SelectItem>
                                      <SelectItem value="Certification">Certification</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Proficiency Level</Label>
                                  <Select
                                    value={skill.level}
                                    onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Beginner">Beginner</SelectItem>
                                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                                      <SelectItem value="Advanced">Advanced</SelectItem>
                                      <SelectItem value="Expert">Expert</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Certificates Tab */}
                {activeTab === 'certificates' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Certificates & Achievements</h2>
                      <Button onClick={addCertificate} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Certificate
                      </Button>
                    </div>
                    
                    {resumeData.certificates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No certificates added yet.</p>
                        <p className="text-sm">Click "Add Certificate" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.certificates.map((cert, index) => (
                          <Card key={cert.id} className="border-l-4 border-l-yellow-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Certificate #{index + 1}</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCertificate(cert.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Certificate Name *</Label>
                                  <Input
                                    value={cert.name}
                                    onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                                    placeholder="AWS Certified Solutions Architect"
                                  />
                                </div>
                                <div>
                                  <Label>Issuing Authority *</Label>
                                  <Input
                                    value={cert.issuer}
                                    onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                                    placeholder="Amazon Web Services"
                                  />
                                </div>
                                <div>
                                  <Label>Issue Date</Label>
                                  <Input
                                    type="date"
                                    value={cert.issueDate}
                                    onChange={(e) => updateCertificate(cert.id, 'issueDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Expiry Date (Optional)</Label>
                                  <Input
                                    type="date"
                                    value={cert.expiryDate || ''}
                                    onChange={(e) => updateCertificate(cert.id, 'expiryDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Credential ID (Optional)</Label>
                                  <Input
                                    value={cert.credentialId || ''}
                                    onChange={(e) => updateCertificate(cert.id, 'credentialId', e.target.value)}
                                    placeholder="Certificate ID or Badge Number"
                                  />
                                </div>
                                <div>
                                  <Label>Verification URL (Optional)</Label>
                                  <Input
                                    value={cert.verificationUrl || ''}
                                    onChange={(e) => updateCertificate(cert.id, 'verificationUrl', e.target.value)}
                                    placeholder="https://verify.certificate.com"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const tabs = ['personal', 'experience', 'education', 'skills', 'certificates'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    disabled={activeTab === 'personal'}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const tabs = ['personal', 'experience', 'education', 'skills', 'certificates'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    disabled={activeTab === 'certificates'}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Resume Enhancer Modal */}
        {showAIEnhancer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
              <AIResumeEnhancer
                resumeData={resumeData}
                onResumeUpdate={(enhancedData) => {
                  setResumeData(enhancedData);
                  setShowAIEnhancer(false);
                }}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAIEnhancer(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
