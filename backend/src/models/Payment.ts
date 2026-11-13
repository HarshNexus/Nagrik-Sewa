import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  workerId?: mongoose.Types.ObjectId;

  razorpayOrderId: string;
  razorpayPaymentId?: string;

  // Amounts in rupees. amount = serviceAmount + gst + platformFee.
  amount: number;
  serviceAmount: number;
  gst: number;
  platformFee: number;
  currency: string;

  method?: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  // 'test' when the Razorpay key is rzp_test_*: no real money moves.
  mode: 'test' | 'live';
  failureReason?: string;
  receiptNumber?: string;
  paidAt?: Date;

  // Razorpay event IDs already processed, for webhook idempotency.
  webhookEventIds: string[];

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  workerId: { type: Schema.Types.ObjectId },

  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String, index: { unique: true, sparse: true } },

  amount: { type: Number, required: true, min: 0 },
  serviceAmount: { type: Number, required: true, min: 0 },
  gst: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },

  method: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  mode: { type: String, enum: ['test', 'live'], required: true },
  failureReason: String,
  receiptNumber: String,
  paidAt: Date,

  webhookEventIds: { type: [String], default: [], select: false }
}, { timestamps: true });

paymentSchema.index({ createdAt: -1 });

export const Payment = (mongoose.models.Payment as mongoose.Model<IPayment>) || mongoose.model<IPayment>('Payment', paymentSchema);
