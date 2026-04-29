import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Booking } from '../models/Booking';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RefundRequest {
  payment_id: string;
  amount: number;
  reason?: string;
}

// Create payment order
export const createPaymentOrder = async (
  bookingId: string,
  amount: number,
  currency: string = 'INR'
): Promise<PaymentOrder> => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        purpose: 'service_payment'
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Update booking with order ID
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'payment.transactionId': order.id,
        'payment.status': 'pending'
      }
    });

    return {
      id: order.id,
      amount: Number(order.amount) / 100, // Convert back to rupees
      currency: order.currency,
      status: order.status,
      created_at: order.created_at
    };
  } catch (error) {
    console.error('Create payment order error:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify payment signature
export const verifyPaymentSignature = (verification: PaymentVerification): boolean => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verification;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

// Process successful payment
export const processSuccessfulPayment = async (
  bookingId: string,
  verification: PaymentVerification
): Promise<void> => {
  try {
    const isValid = verifyPaymentSignature(verification);
    
    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Update booking payment status
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'payment.status': 'paid',
        'payment.transactionId': verification.razorpay_payment_id,
        'payment.paymentGatewayResponse': verification,
        'payment.paidAt': new Date()
      },
      $push: {
        'tracking.milestones': {
          status: 'payment_completed',
          timestamp: new Date(),
          description: 'Payment successful',
          updatedBy: 'system'
        }
      }
    });

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(verification.razorpay_payment_id);
    
    console.log('Payment processed successfully:', {
      bookingId,
      paymentId: verification.razorpay_payment_id,
      amount: Number(payment.amount) / 100,
      method: payment.method
    });

  } catch (error) {
    console.error('Process payment error:', error);
    
    // Update booking with failed payment
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'payment.status': 'failed'
      }
    });
    
    throw error;
  }
};

// Process refund
export const processRefund = async (refundRequest: RefundRequest): Promise<any> => {
  try {
    const refund = await razorpay.payments.refund(refundRequest.payment_id, {
      amount: refundRequest.amount * 100, // Convert to paise
      notes: {
        reason: refundRequest.reason || 'Booking cancellation'
      }
    });

    return {
      id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      created_at: refund.created_at
    };
  } catch (error) {
    console.error('Refund error:', error);
    throw new Error('Failed to process refund');
  }
};

// Process refund for booking
export const processBookingRefund = async (
  bookingId: string,
  refundAmount: number,
  reason?: string
): Promise<void> => {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking || !booking.payment.transactionId) {
      throw new Error('Booking or payment not found');
    }

    if (booking.payment.status !== 'paid') {
      throw new Error('Payment not in paid status');
    }

    // Process refund
    const refund = await processRefund({
      payment_id: booking.payment.transactionId,
      amount: refundAmount,
      reason
    });

    // Update booking with refund details
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'payment.status': refundAmount >= booking.pricing.totalAmount ? 'refunded' : 'partially_refunded',
        'payment.refundAmount': refundAmount,
        'payment.refundReason': reason,
        'payment.refundedAt': new Date()
      },
      $push: {
        'tracking.milestones': {
          status: 'refund_processed',
          timestamp: new Date(),
          description: `Refund of ₹${refundAmount} processed`,
          updatedBy: 'system'
        }
      }
    });

    console.log('Refund processed successfully:', {
      bookingId,
      refundId: refund.id,
      amount: refundAmount
    });

  } catch (error) {
    console.error('Booking refund error:', error);
    throw error;
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId: string): Promise<any> => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      id: payment.id,
      amount: Number(payment.amount) / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      created_at: payment.created_at,
      captured: payment.captured
    };
  } catch (error) {
    console.error('Get payment details error:', error);
    throw new Error('Failed to fetch payment details');
  }
};

// Calculate platform commission
export const calculateCommission = (amount: number, rate: number = 0.05): number => {
  return Math.round(amount * rate);
};

// Calculate worker earnings
export const calculateWorkerEarnings = (totalAmount: number, platformFee: number): number => {
  return totalAmount - platformFee;
};

// Calculate taxes
export const calculateTaxes = (amount: number): { gst: number; total: number } => {
  const gst = Math.round(amount * 0.18); // 18% GST
  return {
    gst,
    total: amount + gst
  };
};

// Generate invoice number
export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `INV-${timestamp}-${random}`.toUpperCase();
};

// Validate UPI ID
export const validateUPIId = (upiId: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+$/;
  return upiRegex.test(upiId);
};

// Payment method configurations
export const paymentMethods = {
  upi: {
    name: 'UPI',
    providers: ['PhonePe', 'Paytm', 'GooglePay', 'BHIM'],
    processingFee: 0,
    instantSettlement: true
  },
  card: {
    name: 'Credit/Debit Card',
    processingFee: 0.02, // 2%
    instantSettlement: false
  },
  netbanking: {
    name: 'Net Banking',
    processingFee: 0.015, // 1.5%
    instantSettlement: false
  },
  wallet: {
    name: 'Digital Wallet',
    providers: ['Paytm', 'PhonePe', 'AmazonPay'],
    processingFee: 0.01, // 1%
    instantSettlement: true
  },
  cash: {
    name: 'Cash on Service',
    processingFee: 0,
    instantSettlement: false
  }
};

// Webhook signature verification
export const verifyWebhookSignature = (body: string, signature: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};

// Handle payment webhook
export const handlePaymentWebhook = async (event: any): Promise<void> => {
  try {
    const { event: eventType, payload } = event;
    
    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;
      
      default:
        console.log('Unhandled webhook event:', eventType);
    }
  } catch (error) {
    console.error('Webhook handling error:', error);
    throw error;
  }
};

const handlePaymentCaptured = async (payment: any): Promise<void> => {
  // Find booking by order receipt
  const booking = await Booking.findOne({
    'payment.transactionId': payment.order_id
  });

  if (booking) {
    await Booking.findByIdAndUpdate(booking._id, {
      $set: {
        'payment.status': 'paid',
        'payment.paidAt': new Date(payment.created_at * 1000)
      }
    });
  }
};

const handlePaymentFailed = async (payment: any): Promise<void> => {
  const booking = await Booking.findOne({
    'payment.transactionId': payment.order_id
  });

  if (booking) {
    await Booking.findByIdAndUpdate(booking._id, {
      $set: {
        'payment.status': 'failed'
      }
    });
  }
};

const handleRefundProcessed = async (refund: any): Promise<void> => {
  // Handle refund completion
  console.log('Refund processed:', refund);
};
