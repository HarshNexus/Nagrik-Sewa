import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2, 
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    profileSummary: string;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startYear: string;
    endYear: string;
    percentage: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    issueDate: string;
  }>;
  languages: string[];
}

const ResumePreview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = () => {
      try {
        const localData = localStorage.getItem(`resume_${user?._id}`);
        if (localData) {
          setResumeData(JSON.parse(localData));
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeData();
  }, [user]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const exportToPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resume Found</h2>
          <p className="text-gray-600 mb-6">Please create a resume first.</p>
          <Button onClick={() => navigate('/resume-builder')}>
            Create Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only visible on screen, not in print */}
      <div className="print:hidden bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/resume-builder')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Button>
              <h1 className="text-xl font-semibold">Resume Preview</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/resume-builder')}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={exportToPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <div className="bg-white shadow-lg print:shadow-none min-h-[297mm] print:min-h-0">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 print:p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">{resumeData.personal.fullName}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-blue-100">
                {resumeData.personal.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{resumeData.personal.email}</span>
                  </div>
                )}
                {resumeData.personal.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{resumeData.personal.phone}</span>
                  </div>
                )}
                {(resumeData.personal.city || resumeData.personal.state) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{resumeData.personal.city}{resumeData.personal.city && resumeData.personal.state && ', '}{resumeData.personal.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 print:p-6">
            {/* Professional Summary */}
            {resumeData.personal.profileSummary && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.personal.profileSummary}
                </p>
              </section>
            )}

            {/* Work Experience */}
            {resumeData.experience.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {exp.jobTitle}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                        <p className="text-lg font-medium text-blue-600 mr-4">
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                      <p className="text-base font-medium text-green-600 mb-1">
                        {edu.institution}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {edu.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {edu.location}
                          </span>
                        )}
                        {edu.percentage && (
                          <span>Grade: {edu.percentage}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Skills & Competencies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Technical', 'Soft Skills', 'Languages', 'Certification'].map(category => {
                    const categorySkills = resumeData.skills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                        <div className="space-y-2">
                          {categorySkills.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{skill.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {skill.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Certificates */}
            {resumeData.certificates.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Certificates & Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.certificates.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {cert.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-1">
                        {cert.issuer}
                      </p>
                      <p className="text-sm text-gray-600">
                        Issued: {formatDate(cert.issueDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {language}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            font-size: 12pt;
            line-height: 1.4;
          }
          .print\\:hidden { 
            display: none !important; 
          }
          .print\\:p-0 { 
            padding: 0 !important; 
          }
          .print\\:p-6 { 
            padding: 1.5rem !important; 
          }
          .print\\:shadow-none { 
            box-shadow: none !important; 
          }
          .print\\:min-h-0 { 
            min-height: 0 !important; 
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
          .border-l-4 {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;