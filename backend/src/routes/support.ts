import express from 'express';
import { sendEmail } from '../services/email';

const router = express.Router();

// Submit support request
router.post('/submit', async (req, res) => {
  try {
    const { fullName, phone, email, category, priority, subject, description } = req.body;

    // Validate required fields
    if (!fullName || !phone || !email || !category || !subject || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Priority color mapping
    const priorityColors: Record<string, string> = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };

    // Category labels
    const categoryLabels: Record<string, string> = {
      technical: 'Technical Support',
      account: 'Account & Profile',
      payments: 'Payments & Earnings',
      training: 'Training & Certification'
    };

    // Send email to support team
    try {
      await sendEmail({
        to: process.env.WORKER_SUPPORT_EMAIL || 'nagriksewa.connect@gmail.com',
        subject: `[${priority.toUpperCase()}] Support Request: ${subject}`,
        text: `
New Support Request Received

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Category: ${categoryLabels[category] || category}
Priority: ${priority}

Subject: ${subject}

Description:
${description}

---
Sent via Nagrik Sewa Worker Support System
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Nagrik Sewa Worker Support</h1>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb;">
              <div style="background-color: ${priorityColors[priority]}; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold; text-transform: uppercase;">
                ${priority} Priority
              </div>

              <h2 style="color: #1f2937; margin-bottom: 20px;">New Support Request</h2>
              
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Name:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Phone:</td>
                    <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${phone}">${phone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
                    <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Category:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${categoryLabels[category] || category}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #1f2937; margin-top: 0;">Subject</h3>
                <p style="color: #4b5563; margin: 0;">${subject}</p>
              </div>

              <div style="background-color: white; padding: 15px; border-radius: 5px;">
                <h3 style="color: #1f2937; margin-top: 0;">Description</h3>
                <p style="color: #4b5563; white-space: pre-wrap; line-height: 1.6; margin: 0;">${description}</p>
              </div>
            </div>

            <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">This email was sent from the Nagrik Sewa Worker Support System</p>
              <p style="margin: 5px 0 0 0;">Reply directly to this email to respond to the worker</p>
            </div>
          </div>
        `,
        replyTo: email // Allow support team to reply directly
      });

      // Send confirmation email to the worker
      await sendEmail({
        to: email,
        subject: 'Support Request Received - Nagrik Sewa',
        text: `
Dear ${fullName},

Thank you for contacting Nagrik Sewa Worker Support.

We have received your support request regarding: ${subject}

Our support team will review your request and respond within 24 hours. For urgent issues, please call our helpline at ${process.env.WORKER_SUPPORT_PHONE || '+91 7983454047'}.

Request Details:
- Category: ${categoryLabels[category] || category}
- Priority: ${priority}
- Reference: REQ-${Date.now()}

Best regards,
Nagrik Sewa Support Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Nagrik Sewa</h1>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb;">
              <h2 style="color: #1f2937;">Support Request Received</h2>
              
              <p style="color: #4b5563; font-size: 16px;">Dear ${fullName},</p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for contacting <strong>Nagrik Sewa Worker Support</strong>. We have received your support request and our team will respond within 24 hours.
              </p>

              <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Your Request</h3>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Category:</strong> ${categoryLabels[category] || category}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Priority:</strong> ${priority}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Reference:</strong> REQ-${Date.now()}</p>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                For urgent issues, please call our helpline:
              </p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="tel:${process.env.WORKER_SUPPORT_PHONE || '+917983454047'}" 
                   style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  📞 ${process.env.WORKER_SUPPORT_PHONE || '+91 7983454047'}
                </a>
              </div>

              <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                <strong>Nagrik Sewa Support Team</strong>
              </p>
            </div>

            <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">This is an automated confirmation email</p>
              <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
            </div>
          </div>
        `
      });

      res.json({
        success: true,
        message: 'Support request submitted successfully',
        reference: `REQ-${Date.now()}`
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still return success to user, but log the error
      res.json({
        success: true,
        message: 'Support request received. We will contact you soon.',
        note: 'Email notification pending'
      });
    }

  } catch (error) {
    console.error('Support request error:', error);
    res.status(500).json({
      error: 'Failed to submit support request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
