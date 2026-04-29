import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Test endpoint to verify Gemini AI integration
router.get('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      res.status(500).json({
        success: false,
        message: 'Gemini API key not configured'
      });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = "Say 'Hello from Nagrik Sewa AI!' in a friendly way.";
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      message: 'Gemini AI is working!',
      data: {
        aiResponse: response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Gemini AI test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to Gemini AI',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
