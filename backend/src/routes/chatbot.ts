import { Router, Request, Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateInput } from '../middleware/security';
import Joi from 'joi';

const router = Router();

// Validation schemas
const chatbotSchemas = {
  createSupportTicket: Joi.object({
    sessionId: Joi.string().required(),
    userType: Joi.string().valid('customer', 'worker').required(),
    language: Joi.string().required(),
    subject: Joi.string().max(200).required(),
    message: Joi.string().max(2000).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    category: Joi.string().max(100)
  }),
  
  chatFeedback: Joi.object({
    sessionId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    feedback: Joi.string().max(500),
    wasHelpful: Joi.boolean().required()
  })
};

// Interface for support tickets (in real app, this would be a database model)
interface SupportTicket {
  id: string;
  sessionId: string;
  userId?: string;
  userType: 'customer' | 'worker';
  language: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for demo (use database in production)
const supportTickets = new Map<string, SupportTicket>();
const chatFeedbacks = new Map<string, any>();

// Create support ticket when chat is escalated
router.post('/support-ticket', optionalAuth, validateInput(chatbotSchemas.createSupportTicket), async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, userType, language, subject, message, priority, category } = req.body;
    const userId = req.user?._id?.toString();

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const ticket: SupportTicket = {
      id: ticketId,
      sessionId,
      userId,
      userType,
      language,
      subject,
      message,
      priority,
      category,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    supportTickets.set(ticketId, ticket);

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification to support team
    // 3. Create entry in support dashboard
    // 4. Send SMS/push notification for urgent tickets

    console.log('Support ticket created:', {
      ticketId,
      sessionId,
      userType,
      priority,
      userId
    });

    res.json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticketId,
        status: ticket.status,
        estimatedResponseTime: priority === 'urgent' ? '15 minutes' : priority === 'high' ? '1 hour' : '4 hours'
      }
    });
  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket'
    });
  }
});

// Submit chat feedback
router.post('/feedback', optionalAuth, validateInput(chatbotSchemas.chatFeedback), async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, rating, feedback, wasHelpful } = req.body;
    const userId = req.user?._id;

    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatFeedback = {
      id: feedbackId,
      sessionId,
      userId,
      rating,
      feedback,
      wasHelpful,
      createdAt: new Date()
    };

    chatFeedbacks.set(feedbackId, chatFeedback);

    console.log('Chat feedback received:', {
      feedbackId,
      sessionId,
      rating,
      wasHelpful,
      userId
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback',
      data: { feedbackId }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// Get user's support tickets
router.get('/support-tickets', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id.toString();
    
    const userTickets = Array.from(supportTickets.values())
      .filter(ticket => ticket.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
      success: true,
      data: { tickets: userTickets }
    });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets'
    });
  }
});

// Get ticket status
router.get('/support-tickets/:ticketId', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = supportTickets.get(ticketId);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
      return;
    }

    // Check if user has access to this ticket
    if (req.user && ticket.userId !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Get ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket status'
    });
  }
});

// Chatbot analytics endpoint (for monitoring)
router.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  try {
    const totalTickets = supportTickets.size;
    const totalFeedbacks = chatFeedbacks.size;
    
    const ticketsByPriority = Array.from(supportTickets.values()).reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageRating = Array.from(chatFeedbacks.values())
      .reduce((sum, feedback) => sum + feedback.rating, 0) / chatFeedbacks.size || 0;

    res.json({
      success: true,
      data: {
        totalTickets,
        totalFeedbacks,
        ticketsByPriority,
        averageRating: Math.round(averageRating * 10) / 10,
        helpfulPercentage: Array.from(chatFeedbacks.values())
          .filter(f => f.wasHelpful).length / chatFeedbacks.size * 100 || 0
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;
