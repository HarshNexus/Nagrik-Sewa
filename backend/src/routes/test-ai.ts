import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendEmail } from '../services/email';

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

// Test endpoint to verify Resend email integration
router.get('/test-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const testEmail = process.env.SUPPORT_EMAIL || 'test@example.com';
    
    console.log('[TEST-EMAIL] Starting email test');
    console.log(`[TEST-EMAIL] Sending test email to: ${testEmail}`);

    const result = await sendEmail({
      to: testEmail,
      subject: 'Nagrik Sewa - Email Service Test',
      template: 'email-otp',
      data: {
        name: 'Test User',
        otp: '123456'
      }
    });

    if (result.success) {
      console.log('[TEST-EMAIL] ✅ Email sent successfully');
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('[TEST-EMAIL] ❌ Email sending failed:', result.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('[TEST-EMAIL] Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Test email error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
