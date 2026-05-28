import mongoose from 'mongoose';

const DEFAULT_DEV_URI = 'mongodb://127.0.0.1:27017/nagrik-sewa';

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

class Database {
  private static instance: Database;
  private isConnected = false;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
  }

  private getMongoUri(): string | undefined {
    let configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (configuredUri?.trim()) {
      const uri = configuredUri.trim();
      
      // CRITICAL: Ensure the database name is included in the connection string
      // Production MongoDB Atlas URIs should end with /nagrik-sewa
      if (!uri.includes('/nagrik-sewa')) {
        // If it doesn't have the database name, append it
        if (uri.endsWith('/')) {
          configuredUri = uri + 'nagrik-sewa';
        } else if (!uri.includes('?')) {
          configuredUri = uri + '/nagrik-sewa';
        } else {
          // Has query parameters but no database name - this is an error
          console.warn('⚠️  WARNING: MongoDB URI may not have explicit database name');
        }
      }
      
      console.log('[DB] MongoDB URI configured (database: nagrik-sewa)');
      return configuredUri;
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'MONGODB_URI is not set. Falling back to local MongoDB at mongodb://127.0.0.1:27017/nagrik-sewa',
      );
      return DEFAULT_DEV_URI;
    }

    return undefined;
  }

  private getConnectionOptions(): mongoose.ConnectOptions {
    return {
      maxPoolSize: parsePositiveInt(process.env.DB_MAX_POOL_SIZE, 10),
      minPoolSize: parsePositiveInt(process.env.DB_MIN_POOL_SIZE, 1),
      serverSelectionTimeoutMS: parsePositiveInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS, 5000),
      socketTimeoutMS: parsePositiveInt(process.env.DB_SOCKET_TIMEOUT_MS, 60000),
      connectTimeoutMS: parsePositiveInt(process.env.DB_CONNECT_TIMEOUT_MS, 10000),
      heartbeatFrequencyMS: parsePositiveInt(process.env.DB_HEARTBEAT_MS, 10000),
      retryWrites: true,
      autoIndex: process.env.NODE_ENV !== 'production',
    };
  }

  private bindConnectionEvents(): void {
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      this.isConnected = true;
    });
  }

  public async connect(): Promise<void> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      console.log('[DB] Already connected to MongoDB');
      return;
    }

    const shouldSkip = process.env.SKIP_DB_CONNECTION === 'true';
    if (shouldSkip) {
      console.warn('[DB] Skipping MongoDB connection because SKIP_DB_CONNECTION=true');
      return;
    }

    const mongoUri = this.getMongoUri();
    if (!mongoUri) {
      const error = 'MONGODB_URI environment variable is not defined';
      console.error('[DB] CRITICAL ERROR:', error);
      throw new Error(error);
    }

    mongoose.set('bufferCommands', false);

    const maxRetries = parsePositiveInt(process.env.DB_CONNECT_RETRIES, 3);
    const retryDelayMs = parsePositiveInt(process.env.DB_RETRY_DELAY_MS, 2000);
    let lastError: unknown;

    console.log('[DB] Attempting to connect to MongoDB...');
    console.log('[DB] Environment:', {
      env: process.env.NODE_ENV,
      dbName: 'nagrik-sewa',
      maxRetries,
      retryDelayMs
    });

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        console.log(`[DB] Connection attempt ${attempt}/${maxRetries}...`);
        await mongoose.connect(mongoUri, this.getConnectionOptions());
        this.isConnected = true;
        this.bindConnectionEvents();
        
        const dbName = mongoose.connection.db?.databaseName || 'unknown';
        console.log('✅ [DB] MongoDB connected successfully', {
          database: dbName,
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          port: mongoose.connection.port
        });
        return;
      } catch (error) {
        lastError = error;
        this.isConnected = false;

        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[DB] Connection attempt ${attempt}/${maxRetries} failed:`, errorMessage);

        if (attempt >= maxRetries) {
          const failureMessage = `MongoDB connection failed after ${maxRetries} attempts. ${errorMessage}`;
          console.error('❌ [DB] CRITICAL:', failureMessage);
          throw new Error(failureMessage);
          break;
        }

        console.error(`MongoDB connection attempt ${attempt}/${maxRetries} failed. Retrying...`);
        await new Promise((resolve) => {
          setTimeout(resolve, retryDelayMs);
        });
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Failed to connect to MongoDB');
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public async ping(): Promise<boolean> {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return false;
    }

    try {
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error);
      return false;
    }
  }
}

export const database = new Database();

export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: Date;
}> => {
  try {
    const isConnected = database.getConnectionStatus();
    const canPing = await database.ping();

    if (isConnected && canPing) {
      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        timestamp: new Date(),
      };
    }

    return {
      status: 'unhealthy',
      message: 'Database connection issues detected',
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date(),
    };
  }
};
