import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Booking, IBooking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { WorkerProfile } from '../models/WorkerProfile';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import {
  razorpay,
  verifyPaymentSignature,
  verifyWebhookSignature,
  generateInvoiceNumber
} from '../services/payment';

const router = Router();

const getMode = (): 'test' | 'live' =>
  (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_live_') ? 'live' : 'test';

const BOOKING_PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'wallet'];

const buildSummary = async (booking: IBooking) => {
  const worker: any =
    (await WorkerProfile.findById(booking.workerId).select('firstName lastName experience rating')) ||
    (await User.findById(booking.workerId).select('firstName lastName'));
  const { basePrice, emergencyCharges = 0, travelCharges = 0, tax, platformFee, totalAmount } = booking.pricing;

  return {
    bookingId: booking.bookingId,
    bookingStatus: booking.status,
    paymentStatus: booking.payment.status,
    service: booking.serviceDetails.serviceName,
    category: booking.serviceDetails.category,
    schedule: {
      date: booking.schedule.requestedDate,
      time: booking.schedule.requestedTime,
      hours: booking.schedule.estimatedDuration / 60
    },
    worker: worker && {
      name: `${worker.firstName} ${worker.lastName || ''}`.trim(),
      experience: worker.experience,
      rating: worker.rating?.average
    },
    pricing: {
      serviceAmount: basePrice + emergencyCharges + travelCharges,
      gst: tax.gst,
      platformFee,
      total: totalAmount
    },
    mode: getMode()
  };
};

// Marks a payment paid after Razorpay confirms it as captured. Used by both the
// verify endpoint and the webhook; the atomic status filter makes it idempotent.
const markPaid = async (rpPayment: any) => {
  const payment = await Payment.findOne({ razorpayOrderId: rpPayment.order_id });
  if (!payment) return null;

  if (rpPayment.amount !== Math.round(payment.amount * 100)) {
    console.error('[PAYMENT] Amount mismatch for order', rpPayment.order_id);
    return null;
  }

  const paid = await Payment.findOneAndUpdate(
    { _id: payment._id, status: { $ne: 'paid' } },
    {
      $set: {
        status: 'paid',
        razorpayPaymentId: rpPayment.id,
        method: rpPayment.method,
        paidAt: new Date(),
        receiptNumber: generateInvoiceNumber()
      },
      $unset: { failureReason: 1 }
    },
    { new: true }
  );
  if (!paid) return null; // already processed

  const bookingMethod = BOOKING_PAYMENT_METHODS.includes(rpPayment.method) ? { 'payment.method': rpPayment.method } : {};
  await Booking.updateOne({ _id: paid.bookingId }, {
    $set: {
      'payment.status': 'paid',
      'payment.transactionId': rpPayment.id,
      'payment.paidAt': paid.paidAt,
      ...bookingMethod
    },
    $push: {
      'tracking.milestones': {
        status: 'payment_completed',
        timestamp: new Date(),
        description: `Payment of ₹${paid.amount} received`,
        updatedBy: 'system'
      }
    }
  });
  await Booking.updateOne({ _id: paid.bookingId, status: 'pending' }, { $set: { status: 'confirmed' } });
  return paid;
};

// ==================== CUSTOMER ====================

// Booking + price summary for the payment page
router.get('/summary/:bookingId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.params;
  const booking = mongoose.isValidObjectId(bookingId) ? await Booking.findById(bookingId) : null;
  if (!booking || String(booking.customerId) !== String(req.user!._id)) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }
  res.json({ success: true, data: await buildSummary(booking) });
});

// Create (or reuse) the Razorpay order for a booking. The amount always comes
// from the booking's server-side pricing, never from the client.
router.post('/create-order', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.body;
    const booking = mongoose.isValidObjectId(bookingId) ? await Booking.findById(bookingId) : null;
    if (!booking || String(booking.customerId) !== String(req.user!._id)) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    if (booking.status === 'cancelled') {
      res.status(400).json({ success: false, message: 'This booking is cancelled' });
      return;
    }
    if (booking.payment.status === 'paid' || await Payment.exists({ bookingId: booking._id, status: 'paid' })) {
      res.status(409).json({ success: false, message: 'This booking is already paid' });
      return;
    }

    const { totalAmount, platformFee, tax, basePrice, emergencyCharges = 0, travelCharges = 0 } = booking.pricing;

    // Duplicate attempts (double click, retry after failure) reuse the same open order.
    let payment = await Payment.findOne({
      bookingId: booking._id,
      amount: totalAmount,
      status: { $in: ['pending', 'failed', 'cancelled'] }
    }).sort({ createdAt: -1 });

    if (payment) {
      if (payment.status !== 'pending') {
        payment.status = 'pending';
        payment.failureReason = undefined;
        await payment.save();
      }
    } else {
      const order = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // paise
        currency: 'INR',
        receipt: booking.bookingId,
        notes: { bookingId: String(booking._id) }
      });
      payment = await Payment.create({
        bookingId: booking._id,
        customerId: booking.customerId,
        workerId: booking.workerId,
        razorpayOrderId: order.id,
        amount: totalAmount,
        serviceAmount: basePrice + emergencyCharges + travelCharges,
        gst: tax.gst,
        platformFee,
        mode: getMode()
      });
    }

    const user: any = req.user;
    res.json({
      success: true,
      data: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: payment.razorpayOrderId,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        mode: payment.mode,
        prefill: {
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email,
          contact: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Could not start payment. Please try again.' });
  }
});

// Called after Razorpay Checkout succeeds. Nothing is trusted from the browser
// until the signature matches and Razorpay itself reports the payment as captured.
router.post('/verify', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (![razorpay_order_id, razorpay_payment_id, razorpay_signature].every(v => typeof v === 'string' && v)) {
      res.status(400).json({ success: false, message: 'Missing payment details' });
      return;
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment || String(payment.customerId) !== String(req.user!._id)) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }
    if (payment.status === 'paid') {
      res.json({ success: true, data: { paymentId: payment._id, status: 'paid' } });
      return;
    }

    if (!verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      console.error('[PAYMENT] Invalid signature for order', razorpay_order_id);
      await Payment.updateOne({ _id: payment._id, status: 'pending' }, {
        $set: { status: 'failed', failureReason: 'Signature verification failed' }
      });
      res.status(400).json({ success: false, message: 'Payment verification failed' });
      return;
    }

    let rpPayment: any = await razorpay.payments.fetch(razorpay_payment_id);
    if (rpPayment.status === 'authorized') {
      rpPayment = await razorpay.payments.capture(razorpay_payment_id, rpPayment.amount, rpPayment.currency);
    }
    if (rpPayment.order_id !== razorpay_order_id || rpPayment.status !== 'captured') {
      // Not confirmed yet; the webhook will finish it if Razorpay captures it later.
      res.status(202).json({ success: true, data: { paymentId: payment._id, status: 'pending' } });
      return;
    }

    await markPaid(rpPayment);
    const updated = await Payment.findById(payment._id);
    res.json({ success: true, data: { paymentId: payment._id, status: updated?.status } });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Could not verify payment. If money was deducted it will be confirmed automatically.' });
  }
});

// Customer closed Checkout or the attempt failed. Can only move a pending payment.
router.post('/report', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { orderId, status, reason } = req.body;
  if (typeof orderId !== 'string' || !['failed', 'cancelled'].includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid request' });
    return;
  }
  await Payment.updateOne(
    { razorpayOrderId: orderId, customerId: req.user!._id, status: 'pending' },
    { $set: { status, failureReason: typeof reason === 'string' ? reason.slice(0, 300) : undefined } }
  );
  res.json({ success: true });
});

router.get('/my', authenticate, async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const query = { customerId: req.user!._id };

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('bookingId', 'bookingId serviceDetails.serviceName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Payment.countDocuments(query)
  ]);
  res.json({ success: true, data: { payments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
});

router.get('/:id/receipt', authenticate, async (req: Request, res: Response): Promise<void> => {
  const payment = mongoose.isValidObjectId(req.params.id)
    ? await Payment.findById(req.params.id).populate('customerId', 'firstName lastName email phone').populate('bookingId')
    : null;
  const customer: any = payment?.customerId;
  const isOwner = String(customer?._id) === String(req.user!._id);
  if (!payment || (!isOwner && req.user!.role !== 'admin')) {
    res.status(404).json({ success: false, message: 'Receipt not found' });
    return;
  }
  if (payment.status !== 'paid') {
    res.status(400).json({ success: false, message: 'Receipt is available only for paid payments' });
    return;
  }

  const booking: any = payment.bookingId;
  const summary = await buildSummary(booking);
  res.json({
    success: true,
    data: {
      receiptNumber: payment.receiptNumber,
      paidAt: payment.paidAt,
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      method: payment.method,
      mode: payment.mode,
      currency: payment.currency,
      customer: { name: `${customer.firstName} ${customer.lastName || ''}`.trim(), email: customer.email, phone: customer.phone },
      bookingId: booking.bookingId,
      service: summary.service,
      worker: summary.worker?.name,
      serviceAmount: payment.serviceAmount,
      gst: payment.gst,
      platformFee: payment.platformFee,
      total: payment.amount
    }
  });
});

// ==================== ADMIN ====================

router.get('/admin/overview', authenticate, authorize('admin'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const status = req.query.status as string;
  const query: any = ['pending', 'paid', 'failed', 'cancelled'].includes(status) ? { status } : {};

  const [grouped, transactions, total] = await Promise.all([
    Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' }, commission: { $sum: '$platformFee' } } }]),
    Payment.find(query)
      .populate('customerId', 'firstName lastName email')
      .populate('bookingId', 'bookingId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Payment.countDocuments(query)
  ]);

  const by = (s: string) => grouped.find(g => g._id === s);
  res.json({
    success: true,
    data: {
      summary: {
        totalCollected: by('paid')?.amount || 0,
        platformCommission: by('paid')?.commission || 0,
        successfulPayments: by('paid')?.count || 0,
        failedPayments: (by('failed')?.count || 0) + (by('cancelled')?.count || 0),
        pendingPayments: by('pending')?.count || 0
      },
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  });
});

// ==================== WEBHOOK ====================

// Razorpay -> server. Authenticated by signature over the raw body (see index.ts).
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody: Buffer | undefined = (req as any).rawBody;
    if (!rawBody || typeof signature !== 'string' || !verifyWebhookSignature(rawBody.toString('utf8'), signature)) {
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    const { event, payload } = req.body;
    const entity = payload?.payment?.entity;
    if (!entity?.order_id) {
      res.json({ received: true });
      return;
    }

    const eventId = (req.headers['x-razorpay-event-id'] as string) || `${event}:${entity.id}`;
    if (await Payment.exists({ razorpayOrderId: entity.order_id, webhookEventIds: eventId })) {
      res.json({ received: true, duplicate: true });
      return;
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      await markPaid(entity);
    } else if (event === 'payment.failed') {
      await Payment.updateOne({ razorpayOrderId: entity.order_id, status: 'pending' }, {
        $set: { status: 'failed', razorpayPaymentId: entity.id, failureReason: entity.error_description }
      });
    }

    // Recorded after processing so a crash above lets Razorpay's retry run it again.
    await Payment.updateOne({ razorpayOrderId: entity.order_id }, { $addToSet: { webhookEventIds: eventId } });
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
});

export default router;
