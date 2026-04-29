import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  bookingId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  
  // Message content
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'system';
  content: string;
  
  // Media attachments
  attachments?: Array<{
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }>;
  
  // Location data
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  // Message status
  status: 'sent' | 'delivered' | 'read';
  
  // Timestamps
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  
  // System message data
  systemData?: {
    action: string;
    metadata: any;
  };
  
  // Message reactions
  reactions?: Array<{
    userId: mongoose.Types.ObjectId;
    emoji: string;
    reactedAt: Date;
  }>;
  
  // Encryption
  isEncrypted: boolean;
  
  // Reply to message
  replyTo?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  
  sentAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  readAt: Date,
  
  systemData: {
    action: String,
    metadata: Schema.Types.Mixed
  },
  
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isEncrypted: {
    type: Boolean,
    default: false
  },
  
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ bookingId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ status: 1 });

export const Message = (mongoose.models.Message as mongoose.Model<IMessage>) || mongoose.model<IMessage>('Message', messageSchema);

// Notification model
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'booking' | 'payment' | 'message' | 'system' | 'promotion' | 'reminder';
  title: string;
  message: string;
  
  // Related entities
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'booking' | 'user' | 'service' | 'payment';
  
  // Notification data
  data?: any;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Delivery channels
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  
  // Delivery status
  deliveryStatus: {
    push?: {
      sent: boolean;
      sentAt?: Date;
      error?: string;
    };
    email?: {
      sent: boolean;
      sentAt?: Date;
      error?: string;
    };
    sms?: {
      sent: boolean;
      sentAt?: Date;
      error?: string;
    };
    whatsapp?: {
      sent: boolean;
      sentAt?: Date;
      error?: string;
    };
  };
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Expiry
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'message', 'system', 'promotion', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  relatedType: {
    type: String,
    enum: ['booking', 'user', 'service', 'payment']
  },
  
  data: Schema.Types.Mixed,
  
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  channels: {
    push: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    whatsapp: {
      type: Boolean,
      default: false
    }
  },
  
  deliveryStatus: {
    push: {
      sent: Boolean,
      sentAt: Date,
      error: String
    },
    email: {
      sent: Boolean,
      sentAt: Date,
      error: String
    },
    sms: {
      sent: Boolean,
      sentAt: Date,
      error: String
    },
    whatsapp: {
      sent: Boolean,
      sentAt: Date,
      error: String
    }
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = (mongoose.models.Notification as mongoose.Model<INotification>) || mongoose.model<INotification>('Notification', notificationSchema);
