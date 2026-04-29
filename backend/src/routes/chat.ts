import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const getGeminiApiKey = (): string | undefined =>
  process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'hi' } = req.body;

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
          response:
            language === 'hi'
              ? 'AI सेवा अभी कॉन्फ़िगर नहीं है। आप कौन-सी सेवा चाहते हैं (जैसे सफाई, प्लंबिंग, इलेक्ट्रिशियन, पेंटिंग)? अपना शहर/लोकेशन बताइए, मैं आपको अगले स्टेप्स बताता/बताती हूँ।'
              : "AI isn't configured yet. Tell me what service you need (cleaning, plumbing, electrician, painting, etc.) and your city/location, and I'll guide you on the next steps.",
          language
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create context-aware prompt for Nagrik Sewa
    const prompt = `You are an AI assistant for Nagrik Sewa, a home services platform in India. 
    
Context: Nagrik Sewa connects customers with verified home service providers for cleaning, plumbing, electrical work, carpentry, painting, appliance repair, gardening, pest control, moving services, and beauty services.

Language: Respond in ${language === 'hi' ? 'Hindi' : 'English'}.

User message: ${message}

Provide helpful, accurate information about home services. If the user asks about booking, pricing, or specific services, guide them appropriately. Keep responses concise and helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
