import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const getGeminiApiKey = (): string | undefined =>
  process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    mr: 'Marathi',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    pa: 'Punjabi',
    ur: 'Urdu',
  };

  return languages[code] || 'English';
};

const getFallbackMessage = (language: string, userType: 'customer' | 'worker'): string => {
  if (language === 'hi') {
    return userType === 'worker'
      ? 'AI सेवा अभी उपलब्ध नहीं है। आप अपने पंजीकरण, सत्यापन, प्रशिक्षण, या प्रोफ़ाइल से जुड़ा सवाल पूछ सकते हैं, और मैं अगले स्टेप्स बताऊंगा।'
      : 'AI सेवा अभी उपलब्ध नहीं है। आप जो सेवा चाहिए, अपना शहर/लोकेशन, और समय बताइए, मैं अगले स्टेप्स बताऊंगा।';
  }

  return userType === 'worker'
    ? "AI isn't available right now. Tell me about registration, verification, training, or your profile, and I’ll guide you on the next steps."
    : "AI isn't available right now. Tell me which service you need, your city/location, and preferred time, and I'll guide you on the next steps.";
};

const sanitizeResponse = (text: string): string =>
  text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[\s]*[-•]\s+/gm, '')
    .replace(/^[\s]*\d+[.)]\s+/gm, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en', userType = 'customer' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      // Graceful fallback when AI key isn't configured (common in local/dev).
      return res.status(200).json({
        success: true,
        data: {
          response: getFallbackMessage(language, userType),
          language
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const serviceGuidance = userType === 'worker'
      ? 'Help workers with registration, verification, training, earnings, and profile optimization.'
      : 'Help customers with booking services, finding workers, pricing, tracking appointments, and safety questions.';

    // Create context-aware prompt for Nagrik Sewa
    const prompt = `You are an AI assistant for Nagrik Sewa, a home services platform in India. 
    
Context: Nagrik Sewa connects customers with verified home service providers for cleaning, plumbing, electrical work, carpentry, painting, appliance repair, gardening, pest control, moving services, and beauty services.

User type: ${userType}

${serviceGuidance}

Language: Respond in ${getLanguageName(language)}.

User message: ${message}

Provide helpful, accurate information about home services. If the user asks about booking, pricing, or specific services, guide them appropriately. Keep responses concise, helpful, and professional. Use plain text only. Do not use markdown, bullet symbols, asterisks, or numbered lists.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
  const text = sanitizeResponse(response.text());

    res.status(200).json({
      success: true,
      data: {
        response: text,
        language
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Chat service temporarily unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
