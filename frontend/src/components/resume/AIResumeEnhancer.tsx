import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Eye, 
  RefreshCw,
  CheckCircle,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { chatbotService } from '../../services/chatbot';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from '../../hooks/use-toast';

interface AIResumeEnhancerProps {
  resumeData: any;
  onResumeUpdate: (enhancedData: any) => void;
}

export const AIResumeEnhancer: React.FC<AIResumeEnhancerProps> = ({ 
  resumeData, 
  onResumeUpdate 
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [enhancedContent, setEnhancedContent] = useState<any>(null);
  const { language } = useLanguage();

  const handleEnhanceResume = async () => {
    if (!resumeData?.personal?.fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and some basic information before enhancing.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await chatbotService.enhanceResume(resumeData, language);
      setEnhancedContent(enhanced);
      
      toast({
        title: "Resume Enhanced!",
        description: "AI has improved your resume content. Review the suggestions below.",
      });
    } catch (error) {
      console.error('Resume enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance resume at the moment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateContent = async () => {
    const jobTitle = resumeData?.experience?.[0]?.jobTitle || 'Service Provider';
    const experience = resumeData?.experience?.length || 0;
    const skills = resumeData?.skills?.map((s: any) => s.skillName).filter(Boolean) || [];

    if (!jobTitle && skills.length === 0) {
      toast({
        title: "Need More Information",
        description: "Please add your job title and some skills to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await chatbotService.generateResumeContent(
        jobTitle,
        experience,
        skills,
        language
      );
      
      setSuggestions([
        generated.professionalSummary || generated.generatedContent,
        ...(generated.keyAchievements || []),
        ...(generated.coreCompetencies || [])
      ].filter(Boolean));
      
      toast({
        title: "Content Generated!",
        description: "AI has created professional content suggestions for your resume.",
      });
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content at the moment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyEnhancement = (field: string, content: string) => {
    const updatedData = { ...resumeData };
    
    if (field === 'summary') {
      updatedData.personal.summary = content;
    } else if (field === 'experience' && updatedData.experience?.[0]) {
      updatedData.experience[0].description = content;
    }
    
    onResumeUpdate(updatedData);
    toast({
      title: "Applied Successfully",
      description: "Enhancement has been applied to your resume.",
    });
  };

  const applySuggestion = (suggestion: string) => {
    if (!resumeData.personal.summary) {
      const updatedData = { ...resumeData };
      updatedData.personal.summary = suggestion;
      onResumeUpdate(updatedData);
    } else {
      const updatedData = { ...resumeData };
      if (updatedData.experience?.[0]) {
        updatedData.experience[0].description = suggestion;
      }
      onResumeUpdate(updatedData);
    }
    
    toast({
      title: "Suggestion Applied",
      description: "AI suggestion has been added to your resume.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Enhancement Actions */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-900">AI Resume Assistant</h3>
            <p className="text-sm text-purple-700">Let AI help you create a professional resume</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={handleEnhanceResume}
            disabled={isEnhancing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Enhance Existing Content
          </Button>

          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4 mr-2" />
            )}
            Generate New Content
          </Button>
        </div>
      </Card>

      {/* Enhanced Content Display */}
      {enhancedContent && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            AI Enhanced Content
          </h4>
          
          <div className="space-y-4">
            {enhancedContent.enhancedSummary && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Enhanced Summary
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => applyEnhancement('summary', enhancedContent.enhancedSummary)}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{enhancedContent.enhancedSummary}</p>
              </div>
            )}

            {enhancedContent.improvedSkills && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Enhanced Skills
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => applyEnhancement('skills', enhancedContent.improvedSkills)}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{enhancedContent.improvedSkills}</p>
              </div>
            )}

            {enhancedContent.enhancedContent && (
              <div className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    General Improvements
                  </Badge>
                </div>
                <Textarea
                  value={enhancedContent.enhancedContent}
                  readOnly
                  className="min-h-[100px] text-sm"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Generated Suggestions */}
      {suggestions.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            AI Content Suggestions
          </h4>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-700 flex-1 mr-3">{suggestion}</p>
                  <Button
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-shrink-0"
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="text-lg font-semibold mb-3 text-blue-900">💡 AI Resume Tips</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Use action verbs like "managed," "improved," "implemented" in your descriptions</p>
          <p>• Quantify achievements with numbers and percentages when possible</p>
          <p>• Tailor your skills to match common service industry requirements</p>
          <p>• Include relevant certifications and training programs</p>
          <p>• Keep descriptions concise but impactful</p>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview Resume
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  );
};
