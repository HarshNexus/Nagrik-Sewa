import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as' | 'ur';

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translations: { [key in Language]: Translation };
}

// Basic translations - in a real app, these would be loaded from files
const translations: { [key in Language]: Translation } = {
  en: {
    navigation: {
      home: 'Home',
      services: 'Services',
      workers: 'Workers',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      bookings: 'My Bookings',
      dashboard: 'Dashboard',
      forWorkers: 'For Workers',
      forCustomers: 'For Customers',
      browseWorkers: 'Browse Workers',
      joinAsWorker: 'Join as Worker',
      joinAsCustomer: 'Join as Customer',
      skillTraining: 'Skill Training',
      resumeBuilder: 'Resume Builder',
      getVerified: 'Get Verified',
      workerSupport: 'Worker Support',
      findCustomers: 'Find Customers',
      helpSupport: 'Help & Support',
      support: 'Support',
      serviceCategories: 'Service Categories',
      homeServices: 'Home Services',
      construction: 'Construction',
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      cleaning: 'Cleaning',
      gardening: 'Gardening',
      logout: 'Log out',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    footer: {
      verifiedWorkers: '25K+',
      kycChecked: 'KYC Verified Workers',
      workersCount: '50K+',
      acrossCities: 'Active across 640+ Districts',
      govtRecognized: 'Government Recognized',
      skillIndiaCertified: 'Skill India Certified',
      companyDescription: 'Nagrik Sewa is India\'s first AI-powered home services platform bridging the gap between skilled workers and customers. We empower workers with digital tools and provide customers with verified, skilled professionals.',
      services: 'Services',
      govtSchemes: 'Government Schemes',
      contactUs: 'Contact Us',
      emergencyHelpline: 'Emergency Helpline',
      emergency: 'Emergency',
      copyright: 'All rights reserved.',
      madeBy: 'Made with ❤️ in India for India',
      happyCustomers: 'Happy Customers',
      skilledWorkers: 'Skilled Workers',
      districtsCovered: 'Districts Covered',
      verifiedProfessionals: 'Verified Professionals',
      securePayments: 'Secure Payments',
      platform: 'Platform',
      aboutUs: 'About Us',
      howItWorks: 'How It Works',
      trustSafety: 'Trust & Safety',
      ourServices: 'Our Services',
      findProfessionals: 'Find Professionals',
      careers: 'Careers',
      resources: 'Resources',
      helpCenter: 'Help Center',
      faqs: 'FAQs',
      becomePartner: 'Become a Partner',
      forBusinesses: 'For Businesses',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      backgroundVerified: 'Background Verified',
      qualityAssured: 'Quality Assured',
      sslSecured: 'SSL Secured',
      trustedPlatform: 'Trusted Platform',
      safetyGuidelines: 'Safety Guidelines',
      referEarn: 'Refer & Earn'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      location: 'Location',
      language: 'Language',
      selectState: 'Select State',
      selectDistrict: 'Select District',
      joinAsWorker: 'Join as Worker',
      joinAsCustomer: 'Join as Customer',
      watchDemo: 'Watch Demo',
    },
    services: {
      homeService: 'Home Services',
      findWorkers: 'Find Workers',
      bookNow: 'Book Now',
      viewDetails: 'View Details',
    },
    auth: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
    },
    locationDemo: {
      title: 'Language & Location Demo',
      description: 'Experience our multi-language interface and comprehensive location selection for all Indian states and districts.',
      languageTitle: 'Language Selection',
      languageDesc: 'Choose your preferred language from 13 Indian languages',
      locationTitle: 'Location Selection',
      locationDesc: 'Select your state and district from comprehensive Indian geographic data',
      customersTitle: 'For Customers',
      customerFeature1: 'Find services in your exact location',
      customerFeature2: 'Interface in your preferred language',
      customerFeature3: 'Precise district-level matching',
      workersTitle: 'For Workers',
      workerFeature1: 'Set your service area precisely',
      workerFeature2: 'Work in your native language',
      workerFeature3: 'Connect with local customers',
    },
    home: {
      heroBadge: '🚀 Now Available in 25+ Cities Across India',
      heroTitle: 'AI-Powered Home Services',
      heroTitleHighlight: 'Made Simple',
      heroTitleEnd: 'for Everyone',
      heroDescription: "India's premier digital platform connecting customers with verified service professionals through advanced AI technology.",
      heroSubtitle: 'Trusted by 50,000+ families across India for reliable home services',
      intelligentChatbot: 'Expert AI assistance',
      multilingualAI: 'multilingual support',
      aiProfiles: 'intelligent matching',
      preferredLanguage: 'all in your native language',
      searchPlaceholder: 'Search for services...',
      findWorkers: 'Find Workers',
      orText: 'or',
      browseServices: 'Browse All Services',
      popularServices: 'Popular Services',
      demands: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      services: {
        houseCleaning: 'House Cleaning',
        plumbing: 'Plumbing',
        electricalWork: 'Electrical Work',
        painting: 'Painting',
        carpentry: 'Carpentry',
        gardening: 'Gardening'
      },
      featuresTitle: 'Why Choose Nagrik Sewa?',
      featuresSubtitle: 'Experience the future of home services with cutting-edge technology',
      badges: {
        techBadge: '✨ Powered by Advanced Technology',
        futureReady: '🔮 Future-Ready Platform'
      },
      features: {
        aiMatching: {
          title: 'AI-Powered Matching',
          description: 'Smart algorithm matches you with the best workers based on location, skills, and ratings.'
        },
        multiLanguage: {
          title: 'Multi-Language Support',
          description: 'Platform available in 11+ Indian languages with voice assistant support.'
        },
        verified: {
          title: 'Verified Workers',
          description: 'All workers undergo KYC, Aadhaar verification, and background checks.'
        },
        tracking: {
          title: 'Real-Time Tracking',
          description: 'Track your worker\'s location and job progress in real-time with GPS.'
        },
        resume: {
          title: 'Digital Resume Builder',
          description: 'Workers can build professional resumes showcasing skills and ratings.'
        },
        emergency: {
          title: 'Emergency SOS',
          description: 'One-click emergency button for immediate help and safety alerts.'
        }
      },
      advancedFeaturesSection: {
        title: 'Advanced Features',
        subtitle: "We're building the future of work with innovative features that empower both workers and customers."
      },
      advancedFeatures: {
        training: {
          title: 'Skill Training & Upskilling',
          description: 'Access to government-certified training programs and skill development courses.'
        },
        schemes: {
          title: 'Government Schemes',
          description: 'Discover and apply for relevant government schemes and benefits.'
        },
        analytics: {
          title: 'Performance Analytics',
          description: 'Track your service history, earnings, and customer feedback.'
        },
        community: {
          title: 'Worker Community',
          description: 'Connect with fellow workers, share experiences, and learn together.'
        }
      },
      stats: {
        activeWorkers: 'Active Workers',
        happyCustomers: 'Happy Customers',
        servicesCompleted: 'Services Completed',
        citiesCovered: 'Cities Covered',
        averageRating: 'Average Rating'
      },
      getStarted: 'Get Started Today'
    },
    legal: {
      terms: {
        title: 'Terms of Service',
        subtitle: 'Terms and conditions governing the use of Nagrik Sewa platform',
        lastUpdated: 'Last updated'
      },
      privacy: {
        title: 'Privacy Policy',
        subtitle: 'Your privacy and data security are our top priorities',
        lastUpdated: 'Last updated'
      }
    },
  },
  hi: {
    navigation: {
      home: 'मुख्य पृष्ठ',
      services: 'सेवाएं',
      workers: 'कार्यकर्ता',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      profile: 'प्रोफ़ाइल',
      bookings: 'मेरी बुकिंग',
      dashboard: 'डैशबोर्ड',
      forWorkers: 'कार्यकर्ताओं के लिए',
      forCustomers: 'ग्राहकों के लिए',
      joinAsWorker: 'कार्यकर्ता के रूप में जुड़ें',
      joinAsCustomer: 'ग्राहक के रूप में जुड़ें',
      skillTraining: 'कौशल प्रशिक्षण',
      resumeBuilder: 'रिज्यूमे बिल्डर',
      getVerified: 'सत्यापित हों',
      workerSupport: 'कार्यकर्ता सहायता',
      findCustomers: 'ग्राहक खोजें',
      helpSupport: 'सहायता एवं समर्थन',
      support: 'सहायता',
      serviceCategories: 'सेवा श्रेणियां',
      homeServices: 'घरेलू सेवाएं',
      construction: 'निर्माण',
      electrical: 'बिजली',
      plumbing: 'प्लंबिंग',
      cleaning: 'सफाई',
      gardening: 'बागवानी',
      logout: 'लॉग आउट',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
    },
    footer: {
      verifiedWorkers: '25K+',
      kycChecked: 'KYC सत्यापित कार्यकर्ता',
      workersCount: '50K+',
      acrossCities: '640+ जिलों में सक्रिय',
      govtRecognized: 'सरकारी मान्यता प्राप्त',
      skillIndiaCertified: 'स्किल इंडिया प्रमाणित',
      companyDescription: 'नागरिक सेवा भारत का पहला AI-संचालित घरेलू सेवाओं का प्लेटफॉर्म है जो कुशल कार्यकर्ताओं और ग्राहकों के बीच की खाई को पाटता है। हम कार्यकर्ताओं को डिजिटल टूल्स से सशक्त बनाते हैं और ग्राहकों को सत्यापित, कुशल पेशेवर प्रदान करते हैं।',
      services: 'सेवाएं',
      govtSchemes: 'सरकारी योजनाएं',
      contactUs: 'संपर्क करें',
      emergencyHelpline: 'आपातकालीन हेल्पलाइन',
      emergency: 'आपातकाल',
      copyright: 'सर्वाधिकार सुरक्षित।',
      madeBy: 'भारत में भारत के लिए ❤️ से बनाया गया',
      happyCustomers: 'खुश ग्राहक',
      skilledWorkers: 'कुशल कार्यकर्ता',
      districtsCovered: 'कवर किए गए जिले',
      verifiedProfessionals: 'सत्यापित पेशेवर',
      securePayments: 'सुरक्षित भुगतान',
      platform: 'प्लेटफॉर्म',
      aboutUs: 'हमारे बारे में',
      howItWorks: 'यह कैसे काम करता है',
      trustSafety: 'विश्वास और सुरक्षा',
      ourServices: 'हमारी सेवाएं',
      findProfessionals: 'पेशेवर खोजें',
      careers: 'करियर',
      resources: 'संसाधन',
      helpCenter: 'सहायता केंद्र',
      faqs: 'अक्सर पूछे जाने वाले प्रश्न',
      becomePartner: 'पार्टनर बनें',
      forBusinesses: 'व्यवसायों के लिए',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      backgroundVerified: 'पृष्ठभूमि सत्यापित',
      qualityAssured: 'गुणवत्ता आश्वासित',
      sslSecured: 'SSL सुरक्षित',
      trustedPlatform: 'विश्वसनीय प्लेटफॉर्म',
      safetyGuidelines: 'सुरक्षा दिशानिर्देश',
      referEarn: 'रेफर करें और कमाएं'
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'क्रमबद्ध करें',
      location: 'स्थान',
      language: 'भाषा',
      selectState: 'राज्य चुनें',
      selectDistrict: 'जिला चुनें',
      joinAsWorker: 'कार्यकर्ता के रूप में जुड़ें',
      joinAsCustomer: 'ग्राहक के रूप में जुड़ें',
      watchDemo: 'डेमो देखें',
    },
    services: {
      homeService: 'घरेलू सेवाएं',
      findWorkers: 'कार्यकर्ता खोजें',
      bookNow: 'अभी बुक करें',
      viewDetails: 'विवरण देखें',
    },
    auth: {
      welcomeBack: 'वापसी पर स्वागत है',
      createAccount: 'खाता बनाएं',
      forgotPassword: 'पासवर्ड भूल गए?',
      rememberMe: 'मुझे याद रखें',
    },
    locationDemo: {
      title: 'भाषा और स्थान डेमो',
      description: 'हमारे बहुभाषी इंटरफेस और सभी भारतीय राज्यों और जिलों के लिए व्यापक स्थान चयन का अनुभव करें।',
      languageTitle: 'भाषा चयन',
      languageDesc: '13 भारतीय भाषाओं में से अपनी पसंदीदा भाषा चुनें',
      locationTitle: 'स्थान चयन',
      locationDesc: 'व्यापक भारतीय भौगोलिक डेटा से अपना राज्य और जिला चुनें',
      customersTitle: 'ग्राहकों के लिए',
      customerFeature1: 'अपने सटीक स्थान पर सेवाएं खोजें',
      customerFeature2: 'अपनी पसंदीदा भाषा में इंटरफेस',
      customerFeature3: 'सटीक जिला-स्तरीय मिलान',
      workersTitle: 'कर्मचारियों के लिए',
      workerFeature1: 'अपना सेवा क्षेत्र सटीक रूप से सेट करें',
      workerFeature2: 'अपनी मातृभाषा में काम करें',
      workerFeature3: 'स्थानीय ग्राहकों से जुड़ें',
    },
    home: {
      heroBadge: '🚀 भारत के 25+ शहरों में अब उपलब्ध',
      heroTitle: 'AI-संचालित घरेलू सेवाएं',
      heroTitleHighlight: 'सरल बनाया गया',
      heroTitleEnd: 'सभी के लिए',
      heroDescription: 'उन्नत AI तकनीक के माध्यम से ग्राहकों को सत्यापित सेवा पेशेवरों से जोड़ने वाला भारत का प्रमुख डिजिटल प्लेटफॉर्म।',
      heroSubtitle: 'विश्वसनीय घरेलू सेवाओं के लिए भारत भर के 50,000+ परिवारों द्वारा भरोसेमंद',
      intelligentChatbot: 'विशेषज्ञ AI सहायता',
      multilingualAI: 'बहुभाषी समर्थन',
      aiProfiles: 'बुद्धिमान मैचिंग',
      preferredLanguage: 'आपकी मातृभाषा में',
      searchPlaceholder: 'आपको किस सेवा की आवश्यकता है?',
      findWorkers: 'कार्यकर्ता खोजें',
      orText: 'या',
      browseServices: 'सभी सेवाएं देखें',
      popularServices: 'लोकप्रिय सेवाएं:',
      demands: {
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'कम'
      },
      badges: {
        techBadge: '✨ उन्नत तकनीक से संचालित',
        futureReady: '🔮 भविष्य-तैयार प्लेटफॉर्म'
      },
      featuresTitle: 'नागरिक सेवा क्यों चुनें?',
      featuresSubtitle: 'अत्याधुनिक तकनीक के साथ घरेलू सेवाओं का भविष्य अनुभव करें',
      // Service names in Hindi
      services: {
        houseCleaning: 'घर की सफाई',
        plumbing: 'प्लंबिंग',
        electricalWork: 'बिजली का काम',
        painting: 'पेंटिंग',
        carpentry: 'बढ़ईगिरी',
        gardening: 'बागवानी'
      },
      // Stats section
      happyCustomers: 'खुश ग्राहक',
      skilledWorkers: 'कुशल कार्यकर्ता',
      servicesCompleted: 'पूर्ण सेवाएं',
      citiesCovered: 'शहरों में सेवा',
      averageRating: 'औसत रेटिंग',
      // Testimonials
      testimonials: {
        title: 'लोग क्या कहते हैं',
        subtitle: 'भारत भर के हजारों ग्राहकों और कार्यकर्ताओं द्वारा भरोसेमंद'
      },
      // How it works
      howItWorks: {
        title: 'यह कैसे काम करता है',
        subtitle: 'केवल 3 सरल चरणों में सत्यापित कार्यकर्ताओं से जुड़ें',
        step1: {
          title: 'खोजें और चुनें',
          description: 'आपकी आवश्यकता की सेवा खोजें, कार्यकर्ता प्रोफाइल, रेटिंग और समीक्षाएं देखें। हमारा AI आपको सर्वोत्तम विकल्पों से मिलाता है।'
        },
        step2: {
          title: 'बुक करें और ट्रैक करें',
          description: 'अपने पसंदीदा कार्यकर्ता को बुक करें, सुरक्षित भुगतान करें, और उनके आने पर उनके स्थान को रियल-टाइम में ट्रैक करें।'
        },
        step3: {
          title: 'काम पूरा करवाएं',
          description: 'आपका सत्यापित कार्यकर्ता काम को पेशेवर रूप से पूरा करता है। अपने अनुभव को रेट करें और दूसरों को बेहतरीन कार्यकर्ता खोजने में मदद करें।'
        }
      },
      // Advanced Features
      advancedFeaturesSection: {
        title: 'उन्नत सुविधाएं',
        subtitle: 'हम नवीन सुविधाओं के साथ काम का भविष्य बना रहे हैं जो कार्यकर्ताओं और ग्राहकों दोनों को सशक्त बनाती हैं।'
      },
      features: {
        aiMatching: {
          title: 'AI-संचालित मैचिंग',
          description: 'स्मार्ट एल्गोरिदम आपको स्थान, कौशल और रेटिंग के आधार पर सर्वोत्तम कार्यकर्ताओं से मिलाता है।'
        },
        multiLanguage: {
          title: 'बहुभाषी समर्थन',
          description: 'वॉइस असिस्टेंट समर्थन के साथ 11+ भारतीय भाषाओं में प्लेटफॉर्म उपलब्ध।'
        },
        verified: {
          title: 'सत्यापित कार्यकर्ता',
          description: 'सभी कार्यकर्ता KYC, आधार सत्यापन और पृष्ठभूमि जांच से गुजरते हैं।'
        },
        tracking: {
          title: 'रियल-टाइम ट्रैकिंग',
          description: 'GPS के साथ अपने कार्यकर्ता का स्थान और कार्य प्रगति रियल-टाइम में ट्रैक करें।'
        },
        resume: {
          title: 'डिजिटल रिज्यूमे बिल्डर',
          description: 'कार्यकर्ता कौशल और रेटिंग दिखाने वाले पेशेवर रिज्यूमे बना सकते हैं।'
        },
        emergency: {
          title: 'आपातकालीन SOS',
          description: 'तत्काल सहायता और सुरक्षा अलर्ट के लिए एक-क्लिक आपातकालीन बटन।'
        }
      },
      advancedFeatures: {
        training: {
          title: 'कौशल प्रशिक्षण और अपस्किलिंग',
          description: 'सरकारी-प्रमाणित प्रशिक्षण कार्यक्रमों और कौशल विकास पाठ्यक्रमों तक पहुंच।'
        },
        schemes: {
          title: 'सरकारी योजनाएं',
          description: 'प्रासंगिक सरकारी योजनाओं और लाभों की खोज करें और आवेदन करें।'
        },
        analytics: {
          title: 'प्रदर्शन विश्लेषण',
          description: 'अपनी सेवा इतिहास, कमाई और ग्राहक प्रतिक्रिया को ट्रैक करें।'
        },
        community: {
          title: 'कार्यकर्ता समुदाय',
          description: 'साथी कार्यकर्ताओं से जुड़ें, अनुभव साझा करें और एक साथ सीखें।'
        }
      },
      stats: {
        activeWorkers: 'सक्रिय कार्यकर्ता',
        happyCustomers: 'खुश ग्राहक',
        servicesCompleted: 'पूर्ण सेवाएं',
        citiesCovered: 'कवर किए गए शहर'
      },
      getStarted: 'आज ही शुरुआत करें'
    },
    legal: {
      terms: {
        title: 'सेवा की शर्तें',
        subtitle: 'नागरिक सेवा प्लेटफॉर्म के उपयोग को नियंत्रित करने वाली नियम और शर्तें',
        lastUpdated: 'अंतिम बार अपडेट किया गया'
      },
      privacy: {
        title: 'गोपनीयता नीति',
        subtitle: 'आपकी गोपनीयता और डेटा सुरक्षा हमारी शीर्ष प्राथमिकताएं हैं',
        lastUpdated: 'अंतिम बार अपडेट किया गया'
      }
    },
  },
  bn: {
    navigation: {
      home: 'হোম',
      services: 'সেবা',
      workers: 'কর্মী',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      register: 'নিবন্ধন',
      profile: 'প্রোফাইল',
      bookings: 'আমার বুকিং',
      dashboard: 'ড্যাশবোর্ড',
      forWorkers: 'কর্মীদের জন্য',
      joinAsWorker: 'কর্মী হিসেবে যোগ দিন',
      skillTraining: 'দক্ষতা প্রশিক্ষণ',
      resumeBuilder: 'রিজিউমে তৈরি',
      getVerified: 'যাচাই করুন',
      workerSupport: 'কর্মী সহায়তা',
      helpSupport: 'সাহায্য ও সহায়তা',
      support: 'সহায়তা',
      serviceCategories: 'সেবার ধরন',
      homeServices: 'বাড়ির সেবা',
      construction: 'নির্মাণ',
      electrical: 'বৈদ্যুতিক',
      plumbing: 'প্লাম্বিং',
      cleaning: 'পরিচ্ছন্নতা',
      gardening: 'বাগান করা',
      logout: 'লগ আউট',
    },
    common: {
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফল',
      cancel: 'বাতিল',
      save: 'সংরক্ষণ',
      delete: 'মুছে ফেলুন',
      edit: 'সম্পাদনা',
      view: 'দেখুন',
      search: 'অনুসন্ধান',
      filter: 'ফিল্টার',
      sort: 'সাজান',
      location: 'অবস্থান',
      language: 'ভাষা',
      selectState: 'রাজ্য নির্বাচন করুন',
      selectDistrict: 'জেলা নির্বাচন করুন',
    },
    services: {
      homeService: 'বাড়ির সেবা',
      findWorkers: 'কর্মী খুঁজুন',
      bookNow: 'এখনই বুক করুন',
      viewDetails: 'বিস্তারিত দেখুন',
    },
    auth: {
      welcomeBack: 'ফিরে আসার জন্য স্বাগতম',
      createAccount: 'অ্যাকাউন্ট তৈরি করুন',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      rememberMe: 'আমাকে মনে রাখুন',
    },
  },
  ta: {
    navigation: {
      home: 'முகப்பு',
      services: 'சேவைகள்',
      workers: 'தொழிலாளர்கள்',
      about: 'எங்களைப் பற்றி',
      contact: 'தொடர்பு',
      login: 'உள்நுழைய',
      register: 'பதிவு',
      profile: 'சுயவிவரம்',
      bookings: 'என் முன்பதிவுகள்',
      dashboard: 'டாஷ்போர்டு',
    },
    common: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      cancel: 'ரத்து',
      save: 'சேமி',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      view: 'பார்',
      search: 'தேடு',
      filter: 'வடிகட்டி',
      sort: 'வரிசை',
      location: 'இடம்',
      language: 'மொழி',
      selectState: 'மாநிலம் தேர்ந்தெடுக்கவும்',
      selectDistrict: 'மாவட்டம் தேர்ந்தெடுக்கவும்',
    },
    services: {
      homeService: 'வீட்டு சேவைகள்',
      findWorkers: 'தொழிலாளர்களைக் கண்டறியவும்',
      bookNow: 'இப்போது முன்பதிவு செய்யுங்கள்',
      viewDetails: 'விவரங்களைப் பார்க்கவும்',
    },
    auth: {
      welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
      createAccount: 'கணக்கு உருவாக்கவும்',
      forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
      rememberMe: 'என்னை நினைவில் கொள்ளுங்கள்',
    },
  },
  te: {
    navigation: {
      home: 'హోమ్',
      services: 'సేవలు',
      workers: 'కార్మికులు',
      about: 'మా గురించి',
      contact: 'సంప్రదింపు',
      login: 'లాగిన్',
      register: 'నమోదు',
      profile: 'ప్రొఫైల్',
      bookings: 'నా బుకింగ్‌లు',
      dashboard: 'డాష్‌బోర్డ్',
    },
    common: {
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      cancel: 'రద్దు',
      save: 'సేవ్',
      delete: 'తొలగించు',
      edit: 'సవరించు',
      view: 'చూడండి',
      search: 'వెతకండి',
      filter: 'ఫిల్టర్',
      sort: 'క్రమం',
      location: 'స్థానం',
      language: 'భాష',
      selectState: 'రాష్ట్రాన్ని ఎంచుకోండి',
      selectDistrict: 'జిల్లాను ఎంచుకోండి',
    },
    services: {
      homeService: 'ఇంటి సేవలు',
      findWorkers: 'కార్మికులను కనుగొనండి',
      bookNow: 'ఇప్పుడే బుక్ చేయండి',
      viewDetails: 'వివరాలను చూడండి',
    },
    auth: {
      welcomeBack: 'తిరిగి స్వాగతం',
      createAccount: 'ఖాతా సృష్టించండి',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      rememberMe: 'నన్ను గుర్తుంచుకోండి',
    },
  },
  mr: {
    navigation: {
      home: 'मुख्यपृष्ठ',
      services: 'सेवा',
      workers: 'कामगार',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क',
      login: 'लॉगिन',
      register: 'नोंदणी',
      profile: 'प्रोफाइल',
      bookings: 'माझी बुकिंग',
      dashboard: 'डॅशबोर्ड',
    },
    common: {
      loading: 'लोड होत आहे...',
      error: 'त्रुटी',
      success: 'यश',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      view: 'पहा',
      search: 'शोधा',
      filter: 'फिल्टर',
      sort: 'क्रमवारी',
      location: 'स्थान',
      language: 'भाषा',
      selectState: 'राज्य निवडा',
      selectDistrict: 'जिल्हा निवडा',
    },
    services: {
      homeService: 'घरगुती सेवा',
      findWorkers: 'कामगार शोधा',
      bookNow: 'आता बुक करा',
      viewDetails: 'तपशील पहा',
    },
    auth: {
      welcomeBack: 'परत स्वागत आहे',
      createAccount: 'खाते तयार करा',
      forgotPassword: 'पासवर्ड विसरलात?',
      rememberMe: 'मला लक्षात ठेवा',
    },
  },
  gu: {
    navigation: {
      home: 'હોમ',
      services: 'સેવાઓ',
      workers: 'કામદારો',
      about: 'અમારા વિશે',
      contact: 'સંપર્ક',
      login: 'લોગિન',
      register: 'નોંધણી',
      profile: 'પ્રોફાઇલ',
      bookings: 'મારી બુકિંગ',
      dashboard: 'ડેશબોર્ડ',
    },
    common: {
      loading: 'લોડ થઈ રહ્યું છે...',
      error: 'ભૂલ',
      success: 'સફળતા',
      cancel: 'રદ કરો',
      save: 'સાચવો',
      delete: 'કાઢી નાખો',
      edit: 'સંપાદિત કરો',
      view: 'જુઓ',
      search: 'શોધો',
      filter: 'ફિલ્ટર',
      sort: 'ક્રમ',
      location: 'સ્થાન',
      language: 'ભાષા',
      selectState: 'રાજ્ય પસંદ કરો',
      selectDistrict: 'જિલ્લો પસંદ કરો',
    },
    services: {
      homeService: 'ઘરેલું સેવાઓ',
      findWorkers: 'કામદારો શોધો',
      bookNow: 'હવે બુક કરો',
      viewDetails: 'વિગતો જુઓ',
    },
    auth: {
      welcomeBack: 'પાછા સ્વાગત છે',
      createAccount: 'ખાતું બનાવો',
      forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
      rememberMe: 'મને યાદ રાખો',
    },
  },
  kn: {
    navigation: {
      home: 'ಮುಖ್ಯಪುಟ',
      services: 'ಸೇವೆಗಳು',
      workers: 'ಕಾರ್ಮಿಕರು',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      contact: 'ಸಂಪರ್ಕ',
      login: 'ಲಾಗಿನ್',
      register: 'ನೋಂದಣಿ',
      profile: 'ಪ್ರೊಫೈಲ್',
      bookings: 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    },
    common: {
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      error: 'ದೋಷ',
      success: 'ಯಶಸ್ಸು',
      cancel: 'ರದ್ದುಗೊಳಿಸಿ',
      save: 'ಉಳಿಸಿ',
      delete: 'ಅಳಿಸಿ',
      edit: 'ಸಂಪಾದಿಸಿ',
      view: 'ನೋಡಿ',
      search: 'ಹುಡುಕಿ',
      filter: 'ಫಿಲ್ಟರ್',
      sort: 'ಕ್ರಮ',
      location: 'ಸ್ಥಳ',
      language: 'ಭಾಷೆ',
      selectState: 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      selectDistrict: 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    },
    services: {
      homeService: 'ಮನೆಯ ಸೇವೆಗಳು',
      findWorkers: 'ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ',
      bookNow: 'ಈಗ ಬುಕ್ ಮಾಡಿ',
      viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    },
    auth: {
      welcomeBack: 'ಮತ್ತೆ ಸ್ವಾಗತ',
      createAccount: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ',
      forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
      rememberMe: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ',
    },
  },
  ml: {
    navigation: {
      home: 'ഹോം',
      services: 'സേവനങ്ങൾ',
      workers: 'തൊഴിലാളികൾ',
      about: 'ഞങ്ങളെക്കുറിച്ച്',
      contact: 'ബന്ധപ്പെടുക',
      login: 'ലോഗിൻ',
      register: 'രജിസ്റ്റർ',
      profile: 'പ്രൊഫൈൽ',
      bookings: 'എന്റെ ബുക്കിങ്ങുകൾ',
      dashboard: 'ഡാഷ്ബോർഡ്',
    },
    common: {
      loading: 'ലോഡ് ചെയ്യുന്നു...',
      error: 'പിശക്',
      success: 'വിജയം',
      cancel: 'റദ്ദാക്കുക',
      save: 'സേവ് ചെയ്യുക',
      delete: 'ഇല്ലാതാക്കുക',
      edit: 'എഡിറ്റ് ചെയ്യുക',
      view: 'കാണുക',
      search: 'തിരയുക',
      filter: 'ഫിൽട്ടർ',
      sort: 'ക്രമം',
      location: 'സ്ഥാനം',
      language: 'ഭാഷ',
      selectState: 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
      selectDistrict: 'ജില്ല തിരഞ്ഞെടുക്കുക',
    },
    services: {
      homeService: 'വീട്ടുസേവനങ്ങൾ',
      findWorkers: 'തൊഴിലാളികളെ കണ്ടെത്തുക',
      bookNow: 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
      viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    },
    auth: {
      welcomeBack: 'തിരികെ സ്വാഗതം',
      createAccount: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
      forgotPassword: 'പാസ്വേഡ് മറന്നോ?',
      rememberMe: 'എന്നെ ഓർക്കുക',
    },
  },
  or: {
    navigation: {
      home: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
      services: 'ସେବାଗୁଡ଼ିକ',
      workers: 'ଶ୍ରମିକମାନେ',
      about: 'ଆମ ବିଷୟରେ',
      contact: 'ଯୋଗାଯୋଗ',
      login: 'ଲଗଇନ୍',
      register: 'ରେଜିଷ୍ଟର',
      profile: 'ପ୍ରୋଫାଇଲ୍',
      bookings: 'ମୋର ବୁକିଂଗୁଡ଼ିକ',
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    },
    common: {
      loading: 'ଲୋଡ୍ ହେଉଛି...',
      error: 'ତ୍ରୁଟି',
      success: 'ସଫଳତା',
      cancel: 'ବାତିଲ',
      save: 'ସେଭ୍',
      delete: 'ଡିଲିଟ୍',
      edit: 'ସମ୍ପାଦନା',
      view: 'ଦେଖନ୍ତୁ',
      search: 'ଖୋଜନ୍ତୁ',
      filter: 'ଫିଲ୍ଟର',
      sort: 'କ୍ରମ',
      location: 'ସ୍ଥାନ',
      language: 'ଭାଷା',
      selectState: 'ରାଜ୍ୟ ବାଛନ୍ତୁ',
      selectDistrict: 'ଜିଲ୍ଲା ବାଛନ୍ତୁ',
    },
    services: {
      homeService: 'ଘରୋଇ ସେବା',
      findWorkers: 'ଶ୍ରମିକ ଖୋଜନ୍ତୁ',
      bookNow: 'ବର୍ତ୍ତମାନ ବୁକ୍ କରନ୍ତୁ',
      viewDetails: 'ବିସ୍ତୃତ ବିବରଣୀ ଦେଖନ୍ତୁ',
    },
    auth: {
      welcomeBack: 'ପୁନର୍ବାର ସ୍ୱାଗତ',
      createAccount: 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
      forgotPassword: 'ପାସୱର୍ଡ ଭୁଲି ଗଲେ?',
      rememberMe: 'ମୋତେ ମନେ ରଖନ୍ତୁ',
    },
  },
  pa: {
    navigation: {
      home: 'ਘਰ',
      services: 'ਸੇਵਾਵਾਂ',
      workers: 'ਮਜ਼ਦੂਰ',
      about: 'ਸਾਡੇ ਬਾਰੇ',
      contact: 'ਸੰਪਰਕ',
      login: 'ਲਾਗਇਨ',
      register: 'ਰਜਿਸਟਰ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      bookings: 'ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    },
    common: {
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      error: 'ਗਲਤੀ',
      success: 'ਸਫਲਤਾ',
      cancel: 'ਰੱਦ ਕਰੋ',
      save: 'ਸੇਵ ਕਰੋ',
      delete: 'ਮਿਟਾਓ',
      edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
      view: 'ਦੇਖੋ',
      search: 'ਖੋਜੋ',
      filter: 'ਫਿਲਟਰ',
      sort: 'ਕ੍ਰਮ',
      location: 'ਸਥਾਨ',
      language: 'ਭਾਸ਼ਾ',
      selectState: 'ਰਾਜ ਚੁਣੋ',
      selectDistrict: 'ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    },
    services: {
      homeService: 'ਘਰੇਲੂ ਸੇਵਾਵਾਂ',
      findWorkers: 'ਮਜ਼ਦੂਰ ਲੱਭੋ',
      bookNow: 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
      viewDetails: 'ਵੇਰਵੇ ਦੇਖੋ',
    },
    auth: {
      welcomeBack: 'ਮੁੜ ਸਵਾਗਤ ਹੈ',
      createAccount: 'ਖਾਤਾ ਬਣਾਓ',
      forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
      rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    },
  },
  as: {
    navigation: {
      home: 'ঘৰ',
      services: 'সেৱাসমূহ',
      workers: 'শ্ৰমিকসকল',
      about: 'আমাৰ বিষয়ে',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      register: 'পঞ্জীয়ন',
      profile: 'প্ৰফাইল',
      bookings: 'মোৰ বুকিংসমূহ',
      dashboard: 'ডেছবৰ্ড',
    },
    common: {
      loading: 'লোড হৈ আছে...',
      error: 'ত্ৰুটি',
      success: 'সফলতা',
      cancel: 'বাতিল',
      save: 'সেভ',
      delete: 'মচক',
      edit: 'সম্পাদনা',
      view: 'চাওক',
      search: 'বিচাৰক',
      filter: 'ফিল্টাৰ',
      sort: 'ক্ৰম',
      location: 'স্থান',
      language: 'ভাষা',
      selectState: 'ৰাজ্য বাছক',
      selectDistrict: 'জিলা বাছক',
    },
    services: {
      homeService: 'ঘৰুৱা সেৱা',
      findWorkers: 'শ্ৰমিক বিচাৰক',
      bookNow: 'এতিয়াই বুক কৰক',
      viewDetails: 'বিৱৰণ চাওক',
    },
    auth: {
      welcomeBack: 'পুনৰ স্বাগতম',
      createAccount: 'একাউণ্ট সৃষ্টি কৰক',
      forgotPassword: 'পাছৱৰ্ড পাহৰিলে?',
      rememberMe: 'মোক মনত ৰাখক',
    },
  },
  ur: {
    navigation: {
      home: 'گھر',
      services: 'خدمات',
      workers: 'مزدور',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      login: 'لاگ ان',
      register: 'رجسٹر',
      profile: 'پروفائل',
      bookings: 'میری بکنگز',
      dashboard: 'ڈیش بورڈ',
    },
    common: {
      loading: 'لوڈ ہو رہا ہے...',
      error: 'خرابی',
      success: 'کامیابی',
      cancel: 'منسوخ',
      save: 'محفوظ کریں',
      delete: 'ڈیلیٹ',
      edit: 'ترمیم',
      view: 'دیکھیں',
      search: 'تلاش',
      filter: 'فلٹر',
      sort: 'ترتیب',
      location: 'مقام',
      language: 'زبان',
      selectState: 'ریاست منتخب کریں',
      selectDistrict: 'ضلع منتخب کریں',
    },
    services: {
      homeService: 'گھریلو خدمات',
      findWorkers: 'مزدور تلاش کریں',
      bookNow: 'ابھی بک کریں',
      viewDetails: 'تفصیلات دیکھیں',
    },
    auth: {
      welcomeBack: 'واپس آپ کا استقبال ہے',
      createAccount: 'اکاؤنٹ بنائیں',
      forgotPassword: 'پاس ورڈ بھول گئے؟',
      rememberMe: 'مجھے یاد رکھیں',
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    return stored && ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur'].includes(stored) ? stored : 'en';
  });

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English if translation not found
    if (typeof value !== 'string') {
      let fallback: any = translations.en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      return typeof fallback === 'string' ? fallback : key;
    }
    
    return value;
  };

  const handleSetLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    translations,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
