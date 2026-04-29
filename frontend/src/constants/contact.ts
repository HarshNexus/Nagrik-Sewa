// Contact information constants for Nagrik Sewa
export const CONTACT_INFO = {
  // Emergency contacts
  EMERGENCY_HELPLINE: "112",
  SAFETY_HELPLINE: "+91 79834 54047", 
  TECHNICAL_EMERGENCY: "+91 79834 54047",
  
  // Main support contacts
  MAIN_SUPPORT_PHONE: "+91 79834 54047",
  CUSTOMER_SUPPORT_PHONE: "+91 79834 54047",
  WORKER_SUPPORT_PHONE: "+91 79834 54047",
  WHATSAPP_NUMBER: "917983454047",
  
  // Email addresses
  MAIN_EMAIL: "support@nagriksewa.com",
  PRIVACY_EMAIL: "privacy@nagriksewa.com",
  LEGAL_EMAIL: "legal@nagriksewa.com",
  DPO_EMAIL: "dpo@nagriksewa.com",
  WORKER_SUPPORT_EMAIL: "workers@nagriksewa.com",
  
  // Business information
  COMPANY_NAME: "Nagrik Sewa Technologies Pvt. Ltd.",
  ADDRESS: "Mohali, Punjab, India",
  FULL_ADDRESS: "Nagrik Sewa Technologies Pvt. Ltd., Mohali, Punjab, India",
  
  // Social media and other
  WEBSITE: "https://nagriksewa.com",
  
  // Support availability
  PHONE_AVAILABILITY: "24/7 Available",
  CHAT_AVAILABILITY: "Mon-Sat, 9 AM - 10 PM",
  EMAIL_RESPONSE_TIME: "Response within 4 hours"
};

// Helper function to make phone calls
export const makePhoneCall = (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/\s+/g, '');
  console.log(`Making call to: ${cleanNumber}`);
  window.location.href = `tel:${cleanNumber}`;
};

// Helper function to send emails
export const sendEmail = (email: string, subject?: string) => {
  const mailtoUrl = subject 
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
  window.location.href = mailtoUrl;
};
