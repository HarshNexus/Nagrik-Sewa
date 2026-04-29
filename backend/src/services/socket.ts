import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { Message } from '../models/Message';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface SocketEvents {
  // Authentication
  'authenticate': (token: string) => void;
  'authenticated': (data: { userId: string; role: string }) => void;
  'authentication_error': (error: string) => void;

  // Messaging
  'join_chat': (bookingId: string) => void;
  'leave_chat': (bookingId: string) => void;
  'send_message': (data: MessageData) => void;
  'receive_message': (data: MessageData) => void;
  'typing_start': (data: { bookingId: string; userId: string }) => void;
  'typing_stop': (data: { bookingId: string; userId: string }) => void;
  'user_typing': (data: { userId: string; userName: string }) => void;

  // Booking updates
  'join_booking': (bookingId: string) => void;
  'leave_booking': (bookingId: string) => void;
  'booking_update': (data: BookingUpdateData) => void;
  'booking_status_changed': (data: BookingStatusData) => void;

  // Location tracking
  'location_update': (data: LocationData) => void;
  'worker_location': (data: LocationData) => void;

  // Notifications
  'notification': (data: NotificationData) => void;

  // Connection events
  'user_online': (data: { userId: string; role: string }) => void;
  'user_offline': (data: { userId: string }) => void;
}

interface MessageData {
  bookingId: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'image' | 'location' | 'system';
  content: string;
  attachments?: any[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

interface BookingUpdateData {
  bookingId: string;
  status: string;
  message: string;
  timestamp: Date;
  updatedBy: string;
}

interface BookingStatusData {
  bookingId: string;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
  reason?: string;
}

interface LocationData {
  bookingId: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface NotificationData {
  type: string;
  title: string;
  message: string;
  data?: any;
}

class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, { socketId: string; role: string; lastSeen: Date }> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ALLOWED_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
          return next(new Error('Invalid user'));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId} (${socket.userRole})`);

      // Add user to connected users
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, {
          socketId: socket.id,
          role: socket.userRole!,
          lastSeen: new Date()
        });

        // Notify others about user coming online
        socket.broadcast.emit('user_online', {
          userId: socket.userId,
          role: socket.userRole
        });
      }

      // Handle chat events
      this.setupChatHandlers(socket);

      // Handle booking events
      this.setupBookingHandlers(socket);

      // Handle location events
      this.setupLocationHandlers(socket);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          
          // Notify others about user going offline
          socket.broadcast.emit('user_offline', {
            userId: socket.userId
          });
        }
      });
    });
  }

  private setupChatHandlers(socket: AuthenticatedSocket) {
    // Join chat room for a specific booking
    socket.on('join_chat', async (bookingId: string) => {
      try {
        // Verify user has access to this booking
        const booking = await Booking.findById(bookingId);
        if (!booking) return;

        const hasAccess = booking.customerId.toString() === socket.userId ||
                         booking.workerId?.toString() === socket.userId;

        if (!hasAccess) return;

        socket.join(`chat_${bookingId}`);
        console.log(`User ${socket.userId} joined chat for booking ${bookingId}`);
      } catch (error) {
        console.error('Join chat error:', error);
      }
    });

    // Leave chat room
    socket.on('leave_chat', (bookingId: string) => {
      socket.leave(`chat_${bookingId}`);
      console.log(`User ${socket.userId} left chat for booking ${bookingId}`);
    });

    // Handle message sending
    socket.on('send_message', async (data: MessageData) => {
      try {
        // Verify access to booking
        const booking = await Booking.findById(data.bookingId);
        if (!booking) return;

        const hasAccess = booking.customerId.toString() === socket.userId ||
                         booking.workerId?.toString() === socket.userId;

        if (!hasAccess) return;

        // Create message in database
        const message = new Message({
          bookingId: data.bookingId,
          senderId: socket.userId,
          receiverId: data.receiverId,
          type: data.type,
          content: data.content,
          attachments: data.attachments,
          location: data.location
        });

        await message.save();

        // Send message to chat room
        this.io.to(`chat_${data.bookingId}`).emit('receive_message', {
          ...data,
          messageId: message._id,
          timestamp: message.createdAt
        });

        // Update booking communication stats
        await Booking.findByIdAndUpdate(data.bookingId, {
          $inc: { 'communication.messageCount': 1 },
          $set: { 'communication.lastMessage': new Date() }
        });

      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { bookingId: string }) => {
      socket.to(`chat_${data.bookingId}`).emit('user_typing', {
        userId: socket.userId,
        userName: 'User' // In real app, get from user profile
      });
    });

    socket.on('typing_stop', (data: { bookingId: string }) => {
      socket.to(`chat_${data.bookingId}`).emit('typing_stop', {
        userId: socket.userId
      });
    });
  }

  private setupBookingHandlers(socket: AuthenticatedSocket) {
    // Join booking room for updates
    socket.on('join_booking', async (bookingId: string) => {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return;

        const hasAccess = booking.customerId.toString() === socket.userId ||
                         booking.workerId?.toString() === socket.userId ||
                         socket.userRole === 'admin';

        if (!hasAccess) return;

        socket.join(`booking_${bookingId}`);
        console.log(`User ${socket.userId} joined booking updates for ${bookingId}`);
      } catch (error) {
        console.error('Join booking error:', error);
      }
    });

    // Leave booking room
    socket.on('leave_booking', (bookingId: string) => {
      socket.leave(`booking_${bookingId}`);
    });
  }

  private setupLocationHandlers(socket: AuthenticatedSocket) {
    // Handle location updates from workers
    socket.on('location_update', async (data: LocationData) => {
      try {
        if (socket.userRole !== 'worker') return;

        // Update booking with worker location
        await Booking.findByIdAndUpdate(data.bookingId, {
          $set: {
            'tracking.workerLocation': {
              latitude: data.latitude,
              longitude: data.longitude,
              updatedAt: new Date()
            }
          }
        });

        // Send location to customer
        this.io.to(`booking_${data.bookingId}`).emit('worker_location', {
          bookingId: data.bookingId,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Location update error:', error);
      }
    });
  }

  // Public methods for sending notifications from other parts of the app
  public sendNotificationToUser(userId: string, notification: NotificationData) {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection) {
      this.io.to(userConnection.socketId).emit('notification', notification);
    }
  }

  public sendBookingUpdate(bookingId: string, update: BookingUpdateData) {
    this.io.to(`booking_${bookingId}`).emit('booking_update', update);
  }

  public sendBookingStatusChange(bookingId: string, statusData: BookingStatusData) {
    this.io.to(`booking_${bookingId}`).emit('booking_status_changed', statusData);
  }

  public notifyWorkersInArea(area: { city: string; state: string }, notification: NotificationData) {
    // This would need to be implemented with worker location tracking
    // For now, we'll send to all connected workers
    this.connectedUsers.forEach((connection, userId) => {
      if (connection.role === 'worker') {
        this.io.to(connection.socketId).emit('notification', notification);
      }
    });
  }

  public getConnectedUsers(): Map<string, { socketId: string; role: string; lastSeen: Date }> {
    return this.connectedUsers;
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

let socketService: SocketService;

export const initializeSocketService = (httpServer: HTTPServer): SocketService => {
  socketService = new SocketService(httpServer);
  return socketService;
};

export const getSocketService = (): SocketService => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};
