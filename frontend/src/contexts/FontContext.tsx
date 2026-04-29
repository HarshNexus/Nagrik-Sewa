import React, { createContext, useContext, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as' | 'ur';

interface FontMapping {
  [key: string]: string;
}

const fontMapping: FontMapping = {
  en: 'var(--font-family-en)',
  hi: 'var(--font-family-hi)',
  bn: 'var(--font-family-bn)',
  ta: 'var(--font-family-ta)',
  te: 'var(--font-family-te)',
  mr: 'var(--font-family-mr)',
  gu: 'var(--font-family-gu)',
  kn: 'var(--font-family-kn)',
  ml: 'var(--font-family-ml)',
  or: 'var(--font-family-or)',
  pa: 'var(--font-family-pa)',
  as: 'var(--font-family-as)',
  ur: 'var(--font-family-ur)',
};

interface FontContextType {
  currentFont: string;
  updateFont: (language: Language) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();

  const updateFont = (lang: Language) => {
    const fontFamily = fontMapping[lang] || fontMapping.en;
    
    // Update CSS custom property
    document.documentElement.style.setProperty('--current-font-family', fontFamily);
    
    // Remove all existing language classes
    const body = document.body;
    const existingLangClasses = Array.from(body.classList).filter(className => 
      className.startsWith('lang-')
    );
    existingLangClasses.forEach(className => body.classList.remove(className));
    
    // Add current language class
    body.classList.add(`lang-${lang}`);
    
    // Update document language attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Force re-render of fonts
    const rootElement = document.documentElement;
    rootElement.style.fontFamily = fontFamily;
  };

  // Update font whenever language changes
  useEffect(() => {
    updateFont(language);
  }, [language]);

  const value: FontContextType = {
    currentFont: fontMapping[language] || fontMapping.en,
    updateFont,
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
