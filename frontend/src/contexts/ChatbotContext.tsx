import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { chatbotService, ChatMessage, ChatSession } from '../services/chatbot';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  userType: 'customer' | 'worker';
  
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  setUserType: (type: 'customer' | 'worker') => void;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userType, setUserType] = useState<'customer' | 'worker'>('customer');
  
  const { user } = useAuth();
  const { language } = useLanguage();

  // Initialize chat session when opening chat
  const initializeSession = useCallback(async (): Promise<string | null> => {
    try {
      const newSessionId = await chatbotService.createChatSession(
        userType,
        language,
        user?._id
      );
      setSessionId(newSessionId);
      
      // Add welcome message with proactive guidance
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: getWelcomeMessage(userType, language),
        timestamp: new Date(),
        language: language,
        userType
      };

      const session = chatbotService.getChatSession(newSessionId);
      if (session) {
        session.messages.push(welcomeMessage);
      }

      setMessages([welcomeMessage]);
      return newSessionId;
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      return null;
    }
  }, [userType, language, user?._id]);

  // Get onboarding message for new users
  const getOnboardingMessage = (type: 'customer' | 'worker', language: string): string => {
    const messages: Record<string, Record<string, string>> = {
      en: {
        customer: `🎯 **New to home services? I'll help you get started!**

Here's what I recommend for first-time users:

1️⃣ **Start Small**: Try a simple service like house cleaning or minor repairs
2️⃣ **Check Reviews**: Look for workers with 4+ stars and verified badges
3️⃣ **Ask Questions**: Feel free to message workers before booking
4️⃣ **Be Present**: Stay available during the service window
5️⃣ **Rate & Review**: Help other customers with honest feedback

💡 **Pro Tip**: Book services during weekdays (Mon-Thu) for better availability and sometimes lower prices!

Would you like me to help you with your first booking?`,

        worker: `🚀 **Ready to start your journey as a professional service provider?**

Let me guide you through the essential steps:

1️⃣ **Complete Profile**: Add professional photo and detailed skills
2️⃣ **Get Verified**: Upload required documents (takes 24-48 hours)
3️⃣ **Take Training**: Complete free certification courses
4️⃣ **Set Competitive Rates**: Research local pricing in your area
5️⃣ **Be Responsive**: Quick responses lead to more bookings

💰 **Earning Tip**: Workers who complete training earn 35% more on average!

Ready to start your registration? I can walk you through each step.`
      },
      hi: {
        customer: `🎯 **घरेलू सेवाओं में नए हैं? मैं आपको शुरुआत में मदद करूंगा!**

नए उपयोगकर्ताओं के लिए मेरी सिफारिश:

1️⃣ **छोटी शुरुआत करें**: घर की सफाई या छोटी मरम्मत जैसी सरल सेवा ट्राई करें
2️⃣ **रिव्यू देखें**: 4+ स्टार और वेरिफाइड बैज वाले कामगार चुनें  
3️⃣ **सवाल पूछें**: बुकिंग से पहले कामगार से बेझिझक संदेश करें
4️⃣ **उपलब्ध रहें**: सेवा के समय उपलब्ध रहें
5️⃣ **रेटिंग दें**: ईमानदार फीडबैक से दूसरे ग्राहकों की मदद करें

💡 **प्रो टिप**: सप्ताह के दिन (सोम-गुरु) बुकिंग करें बेहतर उपलब्धता और कभी-कभी कम कीमत के लिए!

क्या आप चाहते हैं कि मैं आपकी पहली बुकिंग में मदद करूं?`,

        worker: `🚀 **पेशेवर सेवा प्रदाता बनने के लिए तैयार हैं?**

मैं आपको आवश्यक चरणों से अवगत कराता हूं:

1️⃣ **प्रोफाइल पूरा करें**: प्रोफेशनल फोटो और विस्तृत स्किल्स जोड़ें
2️⃣ **वेरिफाई करवाएं**: आवश्यक दस्तावेज अपलोड करें (24-48 घंटे)
3️⃣ **ट्रेनिंग लें**: मुफ्त सर्टिफिकेशन कोर्स पूरे करें
4️⃣ **प्रतिस्पर्धी दरें रखें**: अपने क्षेत्र में स्थानीय मूल्य निर्धारण रिसर्च करें
5️⃣ **जवाबदेह बनें**: तुरंत जवाब देने से अधिक बुकिंग मिलती है

💰 **कमाई टिप**: ट्रेनिंग पूरी करने वाले कामगार औसतन 35% अधिक कमाते हैं!

अपना पंजीकरण शुरू करने के लिए तैयार हैं? मैं हर कदम पर आपकी मदद कर सकता हूं।`
      }
    };
    return messages[language]?.[type] || messages.en[type];
  };

  // Get contextual tips based on time and user type
  const getContextualTip = (type: 'customer' | 'worker', language: string): string | null => {
    const hour = new Date().getHours();
    
    // Different tips based on time of day
    if (hour >= 6 && hour < 10) { // Morning
      const morningTips: Record<string, Record<string, string>> = {
        en: {
          customer: "🌅 **Good morning!** Morning bookings (9-11 AM) often have better availability. Many customers prefer starting their day with a clean, organized space.",
          worker: "🌅 **Good morning!** Morning hours are peak booking time! Make sure your profile shows early availability to capture more customers."
        },
        hi: {
          customer: "🌅 **सुप्रभात!** सुबह की बुकिंग (9-11 बजे) में बेहतर उपलब्धता होती है। कई ग्राहक अपने दिन की शुरुआत साफ, व्यवस्थित जगह से करना पसंद करते हैं।",
          worker: "🌅 **सुप्रभात!** सुबह का समय पीक बुकिंग टाइम है! सुनिश्चित करें कि आपका प्रोफाइल सुबह की उपलब्धता दिखाए ताकि अधिक ग्राहक मिलें।"
        }
      };
      return morningTips[language]?.[type] || morningTips.en[type];
    }
    
    if (hour >= 18 && hour < 22) { // Evening
      const eveningTips: Record<string, Record<string, string>> = {
        en: {
          customer: "🌆 **Good evening!** Evening services (6-8 PM) are perfect for after-work appointments. Consider booking cleaning or maintenance services to come home to a fresh space!",
          worker: "🌆 **Good evening!** Many customers book evening services after work. Update your evening availability to catch these prime booking hours."
        },
        hi: {
          customer: "🌆 **शुभ संध्या!** शाम की सेवाएं (6-8 बजे) काम के बाद की अपॉइंटमेंट के लिए बेहतरीन हैं। घर आकर ताज़ी जगह पाने के लिए सफाई या मेंटेनेंस सेवाएं बुक करने पर विचार करें!",
          worker: "🌆 **शुभ संध्या!** कई ग्राहक काम के बाद शाम की सेवाएं बुक करते हैं। इन प्राइम बुकिंग आवर्स को पकड़ने के लिए अपनी शाम की उपलब्धता अपडेट करें।"
        }
      };
      return eveningTips[language]?.[type] || eveningTips.en[type];
    }
    
    return null; // No specific tip for other times
  };

  const getWelcomeMessage = (type: 'customer' | 'worker', language: string): string => {
    const messages: Record<string, Record<string, string>> = {
      en: {
        customer: "Hello! 👋 I'm your Nagrik Sewa AI assistant. I can help you book services, find workers, track appointments, and answer questions. What would you like to know?",
        worker: "Hello! 👋 I'm your Nagrik Sewa AI assistant for workers. I can help with registration, verification, training programs, earnings, and profile optimization. How can I help you?"
      },
      hi: {
        customer: "नमस्ते! 👋 मैं आपका नागरिक सेवा AI सहायक हूं। मैं सेवाएं बुक करने, कामगार खोजने, अपॉइंटमेंट ट्रैक करने में मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
        worker: "नमस्ते! 👋 मैं कामगारों के लिए नागरिक सेवा AI सहायक हूं। मैं पंजीकरण, सत्यापन, प्रशिक्षण, कमाई में मदद कर सकता हूं। कैसे मदद करूं?"
      },
      ta: {
        customer: "வணக்கம்! 👋 நான் உங்கள் நாகரிக சேவா AI உதவியாளர். சேவைகள் முன்பதிவு, தொழிலாளர்களைக் கண்டுபிடித்தல், நியமனங்களைக் கண்காணித்தல் ஆகியவற்றில் உதவ முடியும். என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
        worker: "வணக்கம்! 👋 நான் தொழிலாளர்களுக்கான நாகரிக சேவா AI உதவியாளர். பதிவு, சரிபார்ப்பு, பயிற்சி, வருமானம் ஆகியவற்றில் உதவ முடியும். எப்படி உதவ முடியும்?"
      },
      bn: {
        customer: "নমস্কার! 👋 আমি আপনার নাগরিক সেবা AI সহায়ক। সেবা বুক, কর্মী খোঁজা, অ্যাপয়েন্টমেন্ট ট্র্যাক করতে সাহায্য করতে পারি। কী জানতে চান?",
        worker: "নমস্কার! 👋 আমি কর্মীদের জন্য নাগরিক সেবা AI সহায়ক। নিবন্ধন, যাচাইকরণ, প্রশিক্ষণ, আয়ে সাহায্য করতে পারি। কীভাবে সাহায্য করব?"
      }
    };
    
    return messages[language]?.[type] || messages.en[type];
  };

  const openChat = useCallback(async () => {
    setIsOpen(true);
    if (!sessionId) {
      await initializeSession();
    }
  }, [sessionId, initializeSession]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    let activeSessionId = sessionId;
    if (!activeSessionId || !chatbotService.getChatSession(activeSessionId)) {
      activeSessionId = await initializeSession();
      if (!activeSessionId) return;
      setSessionId(activeSessionId);
    }

    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptSend = async (): Promise<void> => {
      try {
        // Send to AI service and get response
        const response = await chatbotService.sendMessage(activeSessionId, message);
        
        // Update messages with actual response
        const session = chatbotService.getChatSession(activeSessionId);
        if (session) {
          setMessages(session.messages);
        }
        
      } catch (error) {
        console.error(`Message send attempt ${retryCount + 1} failed:`, error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          // Exponential backoff: wait 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          
          // Show retry message to user
          const retryMessage: ChatMessage = {
            id: `retry_${Date.now()}`,
            role: 'assistant',
            content: `🔄 Connection issue. Retrying... (${retryCount}/${maxRetries})`,
            timestamp: new Date(),
            language: language,
            userType
          };
          
          setMessages(prev => [...prev, retryMessage]);
          
          setTimeout(() => {
            // Remove retry message before next attempt
            setMessages(prev => prev.filter(msg => msg.id !== retryMessage.id));
            attemptSend();
          }, delay);
          
          return;
        }
        
        // All retries failed - show comprehensive error message
        const errorType = getErrorType(error);
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: getErrorMessage(errorType, language),
          timestamp: new Date(),
          language: language,
          userType
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    };
    
    try {
      await attemptSend();
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, language, userType, initializeSession]);

  // Determine error type for appropriate handling
  const getErrorType = (error: any): 'network' | 'api' | 'quota' | 'unknown' => {
    if (!navigator.onLine) return 'network';
    
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) return 'quota';
    if (errorMessage.includes('api') || errorMessage.includes('key')) return 'api';
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) return 'network';
    
    return 'unknown';
  };

  // Get appropriate error message based on type and language
  const getErrorMessage = (errorType: string, language: string): string => {
    const messages: Record<string, Record<string, string>> = {
      en: {
        network: `🔌 **Connection Problem**

I'm having trouble connecting to our servers right now.

🔄 **What you can try:**
• Check your internet connection
• Try again in a few moments
• Switch to mobile data if using WiFi

📞 **Need immediate help?**
• Call our 24/7 helpline: 1800-123-NAGRIK
• Use the emergency SOS button in the app
• Email: support@nagriksewa.in

I'll keep trying to reconnect automatically.`,

        api: `🤖 **AI Service Temporarily Unavailable**

Our AI assistant is experiencing technical difficulties.

✨ **Alternative support options:**
• Live chat with human agents (available 24/7)
• Call our support team: 1800-123-NAGRIK
• Browse our Help Center in the app
• Submit a support ticket: support@nagriksewa.in

Your question is important to us - please don't hesitate to use these alternatives!`,

        quota: `⏰ **High Demand Notice**

Our AI assistant is currently experiencing high traffic. 

🚀 **Immediate assistance available:**
• Connect with human support agents
• Call: 1800-123-NAGRIK (24/7 available)
• Emergency services: Press SOS in app
• FAQ section has instant answers

We're working to get AI chat back online shortly!`,

        unknown: `⚠️ **Technical Difficulty**

Something unexpected happened, but don't worry - help is still available!

🔧 **What you can do right now:**
• Try rephrasing your question
• Contact human support: 1800-123-NAGRIK
• Use in-app live chat
• Check our FAQ section

We're investigating this issue and will have it resolved soon.`
      },
      hi: {
        network: `🔌 **कनेक्शन समस्या**

अभी मुझे हमारे सर्वर से जुड़ने में परेशानी हो रही है।

🔄 **आप यह कोशिश कर सकते हैं:**
• अपना इंटरनेट कनेक्शन चेक करें
• कुछ देर बाद दोबारा कोशिश करें
• WiFi इस्तेमाल कर रहे हैं तो मोबाइल डेटा ट्राई करें

📞 **तुरंत मदद चाहिए?**
• हमारी 24/7 हेल्पलाइन कॉल करें: 1800-123-NAGRIK
• ऐप में इमरजेंसी SOS बटन का उपयोग करें
• ईमेल: support@nagriksewa.in

मैं अपने आप दोबारा कनेक्ट करने की कोशिश करता रहूंगा।`
      }
    };
    
    return messages[language]?.[errorType] || messages.en[errorType] || messages.en.unknown;
  };

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    if (isOpen) {
      initializeSession();
    }
  }, [isOpen, initializeSession]);

  // Update user type and reinitialize session
  const handleSetUserType = useCallback(async (type: 'customer' | 'worker') => {
    setUserType(type);
    if (sessionId) {
      chatbotService.closeChatSession(sessionId);
    }
    setSessionId(null);
    setMessages([]);
    
    if (isOpen) {
      await initializeSession();
    }
  }, [sessionId, isOpen, initializeSession]);

  // Auto-detect user type based on auth context
  useEffect(() => {
    if (user?.role) {
      const detectedType = user.role === 'worker' ? 'worker' : 'customer';
      if (detectedType !== userType) {
        handleSetUserType(detectedType);
      }
    }
  }, [user?.role, userType, handleSetUserType]);

  const value: ChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    sessionId,
    userType,
    openChat,
    closeChat,
    sendMessage,
    setUserType: handleSetUserType,
    clearChat
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
