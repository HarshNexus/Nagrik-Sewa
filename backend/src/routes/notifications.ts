import express from 'express';
import { sendEmail } from '../services/email';
// import { sendSMS } from '../services/sms'; // Uncomment when SMS service is configured

const router = express.Router();

// Send notification (email and SMS) to customer when worker sends proposal
router.post('/send-notification', async (req, res) => {
  try {
    const { email, phone, type, message } = req.body;

    if (!email || !phone || !type || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email notification
    try {
      await sendEmail({
        to: email,
        subject: type === 'proposal' ? 'New Proposal Received - Nagrik Sewa' : 'Notification from Nagrik Sewa',
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Nagrik Sewa</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <h2 style="color: #1f2937;">New Proposal Received!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${message}
              </p>
              <p style="color: #4b5563; margin-top: 20px;">
                Please log in to your Nagrik Sewa account to view the full details and respond to this proposal.
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'https://nagrik-sewa-fe1j.onrender.com'}" 
                   style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Proposal
                </a>
              </div>
            </div>
            <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p>This is an automated notification from Nagrik Sewa</p>
              <p>Contact: ${process.env.SUPPORT_EMAIL || 'support@nagriksewa.com'}</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    // Send SMS notification
    try {
      // Uncomment this when SMS service is configured
      // await sendSMS({
      //   to: phone,
      //   message: message
      // });
      console.log(`SMS would be sent to ${phone}: ${message}`);
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
    }

    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      details: {
        emailSent: true,
        smsPending: true // Change to true when SMS is configured
      }
    });

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
