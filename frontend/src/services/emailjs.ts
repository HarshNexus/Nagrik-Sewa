import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface VerificationEmailData {
  to_email: string;
  to_name: string;
  verification_code: string;
  from_name?: string;
  reply_to?: string;
  [key: string]: unknown; // Index signature for EmailJS compatibility
}

// Send verification email from frontend
export const sendVerificationEmail = async (
  userEmail: string,
  userName: string,
  verificationCode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.log('📧 EmailJS not configured - verification code:', verificationCode);
      return {
        success: false,
        message: 'Email service not configured. Please check the console for your verification code.'
      };
    }

    const templateParams: VerificationEmailData = {
      to_email: userEmail,
      to_name: userName,
      verification_code: verificationCode,
      from_name: 'Nagrik Sewa Team',
      reply_to: 'noreply@nagriksewa.com'
    };

    console.log('📧 Sending verification email to:', userEmail);
    
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Verification email sent successfully:', result);
    
    return {
      success: true,
      message: `Verification email sent successfully to ${userEmail}`
    };

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Show verification code in console as fallback
    console.log(`🔑 VERIFICATION CODE (Email failed): ${verificationCode}`);
    
    return {
      success: false,
      message: `Failed to send email. Your verification code is: ${verificationCode}`
    };
  }
};

// Verify EmailJS configuration
export const isEmailJSConfigured = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
};

export default {
  sendVerificationEmail,
  isEmailJSConfigured
};