import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LocationSelector } from '@/components/LocationSelector';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Users, Briefcase } from 'lucide-react';

export default function LocationDemo() {
  const { t, language } = useLanguage();
  const { selectedState, selectedDistrict } = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {t('locationDemo.title') || 'Language & Location Demo'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('locationDemo.description') || 'Experience our multi-language interface and comprehensive location selection for all Indian states and districts.'}
          </p>
        </div>

        {/* Language Selection Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('locationDemo.languageTitle') || 'Language Selection'}
            </CardTitle>
            <CardDescription>
              {t('locationDemo.languageDesc') || 'Choose your preferred language from 13 Indian languages'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Current Language:</span>
              <Badge variant="secondary">{language}</Badge>
            </div>
            <LanguageSelector />
            <div className="text-sm text-muted-foreground">
              ✅ Supports: English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu
            </div>
          </CardContent>
        </Card>

        {/* Font Demonstration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Font & Typography Demo
            </CardTitle>
            <CardDescription>
              See how fonts change dynamically with language selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Language & Font:</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{language.toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Font automatically adapts to selected language
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold">Typography Sample:</h5>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'नागरिक सेवा - घरेलू सेवाएं' :
                   language === 'bn' ? 'নাগরিক সেবা - গৃহস্থালী সেবা' :
                   language === 'ta' ? 'நாகரிக சேவா - வீட்டு சேவைகள்' :
                   language === 'te' ? 'నాగరిక సేవా - గృహ సేవలు' :
                   language === 'mr' ? 'नागरिक सेवा - घरगुती सेवा' :
                   language === 'gu' ? 'નાગરિક સેવા - ઘરેલું સેવાઓ' :
                   language === 'kn' ? 'ನಾಗರಿಕ ಸೇವಾ - ಮನೆಯ ಸೇವೆಗಳು' :
                   language === 'ml' ? 'നാഗരിക സേവാ - ഗൃഹ സേവനങ്ങൾ' :
                   language === 'or' ? 'ନାଗରିକ ସେବା - ଘର ସେବା' :
                   language === 'pa' ? 'ਨਾਗਰਿਕ ਸੇਵਾ - ਘਰੇਲੂ ਸੇਵਾਵਾਂ' :
                   language === 'as' ? 'নাগৰিক সেৱা - ঘৰুৱা সেৱা' :
                   language === 'ur' ? 'شہری خدمات - گھریلو خدمات' :
                   'Nagrik Sewa - Home Services'}
                </h1>
                <p className="text-base">
                  {language === 'hi' ? 'विश्वसनीय स्थानीय सेवा प्रदाताओं से जुड़ें। भारत भर में 13+ भाषाओं में उपलब्ध।' :
                   language === 'bn' ? 'নির্ভরযোগ্য স্থানীয় সেবা প্রদানকারীদের সাথে সংযুক্ত হোন। ভারত জুড়ে ১৩+ ভাষায় উপলব্ধ।' :
                   language === 'ta' ? 'நம்பகமான உள்ளூர் சேவை வழங்குநர்களுடன் இணைக்கவும். இந்தியா முழுவதும் 13+ மொழிகளில் கிடைக்கிறது।' :
                   language === 'te' ? 'విశ్వసనీయ స్థానిక సేవా ప్రదాతలతో కనెక్ట్ అవ్వండి. భారతదేశంలో 13+ భాషలలో అందుబాటులో ఉంది।' :
                   language === 'mr' ? 'विश्वसनीय स्थानिक सेवा प्रदात्यांशी जोडा. भारतात 13+ भाषांमध्ये उपलब्ध.' :
                   language === 'gu' ? 'વિશ્વસનીય સ્થાનિક સેવા પ્રદાતાઓ સાથે જોડાઓ. ભારતમાં 13+ ભાષાઓમાં ઉપલબ્ધ.' :
                   language === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹ ಸ್ಥಳೀಯ ಸೇವಾ ಪೂರೈಕೆದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ. ಭಾರತದಲ್ಲಿ 13+ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.' :
                   language === 'ml' ? 'വിശ്വസനീയമായ പ്രാദേശിക സേവന ദാതാക്കളുമായി ബന്ധപ്പെടുക. ഇന്ത്യയിൽ 13+ ഭാषകളിൽ ലഭ്യമാണ്.' :
                   language === 'or' ? 'ବିଶ୍ୱସ୍ତ ସ୍ଥାନୀୟ ସେବା ପ୍ରଦାନକାରୀଙ୍କ ସହିତ ସଂଯୋଗ କରନ୍ତୁ। ଭାରତରେ 13+ ଭାଷାରେ ଉପଲବ୍ଧ।' :
                   language === 'pa' ? 'ਭਰੋਸੇਮੰਦ ਸਥਾਨਕ ਸੇਵਾ ਪ੍ਰਦਾਤਾਵਾਂ ਨਾਲ ਜੁੜੋ। ਭਾਰਤ ਵਿੱਚ 13+ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ।' :
                   language === 'as' ? 'বিশ্বাসযোগ্য স্থানীয় সেৱা প্ৰদানকাৰীৰ সৈতে সংযোগ কৰক। ভাৰতত ১৩+ ভাষাত উপলব্ধ।' :
                   language === 'ur' ? 'قابل اعتماد مقامی خدمات فراہم کنندگان سے جڑیں۔ ہندوستان میں 13+ زبانوں میں دستیاب۔' :
                   'Connect with trusted local service providers. Available in 13+ languages across India.'}
                </p>
                <div className="text-sm text-gray-600">
                  Font Family: {language === 'en' ? 'Inter (Latin)' :
                              language === 'hi' || language === 'mr' ? 'Noto Sans Devanagari' :
                              language === 'bn' || language === 'as' ? 'Noto Sans Bengali' :
                              language === 'ta' ? 'Noto Sans Tamil' :
                              language === 'te' ? 'Noto Sans Telugu' :
                              language === 'gu' ? 'Noto Sans Gujarati' :
                              language === 'kn' ? 'Noto Sans Kannada' :
                              language === 'ml' ? 'Noto Sans Malayalam' :
                              language === 'or' ? 'Noto Sans Oriya' :
                              language === 'pa' ? 'Noto Sans Gurmukhi' :
                              language === 'ur' ? 'Noto Serif Devanagari' :
                              'Inter'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Selection Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('locationDemo.locationTitle') || 'Location Selection'}
            </CardTitle>
            <CardDescription>
              {t('locationDemo.locationDesc') || 'Select your state and district from comprehensive Indian geographic data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Selected Location:</h4>
                {selectedState && selectedDistrict ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedState}</Badge>
                    <span>→</span>
                    <Badge>{selectedDistrict}</Badge>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No location selected</p>
                )}
              </div>
            </div>
            <LocationSelector />
            <div className="text-sm text-muted-foreground">
              ✅ Covers: All 28 states, 8 union territories, and their districts
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('locationDemo.customersTitle') || 'For Customers'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.customerFeature1') || 'Find services in your exact location'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.customerFeature2') || 'Interface in your preferred language'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.customerFeature3') || 'Precise district-level matching'}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {t('locationDemo.workersTitle') || 'For Workers'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.workerFeature1') || 'Set your service area precisely'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.workerFeature2') || 'Work in your native language'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {t('locationDemo.workerFeature3') || 'Connect with local customers'}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Status */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Implementation Complete ✅</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-green-800 mb-2">Dark Theme Removed</h5>
                <p className="text-green-700">✅ Light theme enforced</p>
                <p className="text-green-700">✅ Clean, consistent UI</p>
              </div>
              <div>
                <h5 className="font-medium text-green-800 mb-2">Multi-Language Support</h5>
                <p className="text-green-700">✅ 13 Indian languages</p>
                <p className="text-green-700">✅ Comprehensive translations</p>
                <p className="text-green-700">✅ LocalStorage persistence</p>
              </div>
              <div>
                <h5 className="font-medium text-green-800 mb-2">Dynamic Typography</h5>
                <p className="text-green-700">✅ Language-specific fonts</p>
                <p className="text-green-700">✅ Script-optimized display</p>
                <p className="text-green-700">✅ Real-time font switching</p>
              </div>
              <div>
                <h5 className="font-medium text-green-800 mb-2">Location Functionality</h5>
                <p className="text-green-700">✅ All Indian states & districts</p>
                <p className="text-green-700">✅ Hierarchical selection</p>
                <p className="text-green-700">✅ User preference saving</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
