import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { language, setLanguage, t } = useLanguage();

  const selectedLanguage = languageOptions.find(lang => lang.code === language);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant === 'default' && (
        <Globe className="h-4 w-4 text-gray-500" />
      )}
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className={variant === 'compact' ? 'w-[140px]' : 'w-[180px]'}>
          <SelectValue>
            <span className="flex items-center gap-2">
              {variant === 'compact' && <Globe className="h-3 w-3" />}
              <span className="font-medium">
                {selectedLanguage?.nativeName || selectedLanguage?.name}
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-xs text-gray-500">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
