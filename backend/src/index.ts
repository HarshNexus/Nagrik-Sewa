import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import { handleDemo } from "./routes/demo";
import { database } from "./config/database";
import { securityHeaders, generalRateLimit, errorHandler, notFound } from "./middleware/security";

// Import routes
import authRoutes from "./routes/auth";
import servicesRoutes from "./routes/services";
import bookingsRoutes from "./routes/bookings";
import chatbotRoutes from "./routes/chatbot";
import chatRoutes from "./routes/chat";
import testAIRoutes from "./routes/test-ai";
import uploadRoutes from "./routes/upload";
import digilockerRoutes from "./routes/digilocker";
import resumeRoutes from "./routes/resume";
import statsRoutes from "./routes/stats";
import notificationsRoutes from "./routes/notifications";
import supportRoutes from "./routes/support";
import adminRoutes from "./routes/admin";
import coursesRoutes from "./routes/courses";
import workersRoutes from "./routes/workers";
import discoveryRoutes from "./routes/discovery";
import {
  performanceMonitor,
  memoryMonitor,
  requestSizeMonitor,
  endpointMonitor,
  getPerformanceStats,
} from "./middleware/performance";

dotenv.config();

const corsOptions = {
  origin: ["https://nagrik-sewa-fe1j.onrender.com", "http://localhost:5173", "http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || "10mb";
const shouldLogRequests = process.env.NODE_ENV !== "production" || process.env.LOG_REQUESTS === "true";

export async function createServer() {
  const app = express();

  // Block server startup until database connection is ready.
  await database.connect();

  // Trust proxy for proper IP detection behind reverse proxies
  app.set("trust proxy", 1);

  // ============================================================================
  // CORS CONFIGURATION (MUST BE FIRST - BEFORE ALL OTHER MIDDLEWARE)
  // ============================================================================
  // Apply CORS globally
  app.use(corsMiddleware);
  
  // Handle preflight OPTIONS requests explicitly
  app.options("*", corsMiddleware);

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan(process.env.HTTP_LOG_FORMAT || "combined"));
  }

  if (shouldLogRequests) {
    app.use((req, _res, next) => {
      console.log(`[REQ] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  // Security middleware
  app.use(securityHeaders);
  app.use(compression({ threshold: 1024 }));

  // Apply rate limiting only to API routes, not static assets
  app.use("/api", generalRateLimit);

  // Performance monitoring middleware
  app.use(performanceMonitor);
  app.use(memoryMonitor);
  app.use(requestSizeMonitor);
  app.use("/api", endpointMonitor);

  // Body parsing middleware
  app.use(express.json({ limit: requestBodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));

  // Health check endpoints
  app.get("/health", async (_req, res) => {
    try {
      const dbHealth = await database.ping();
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: dbHealth ? "connected" : "disconnected",
        environment: process.env.NODE_ENV || "development",
      });
    } catch (_error) {
      res.status(503).json({
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // System metrics endpoint (protected)
  app.get("/metrics", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        const auth = req.headers.authorization;
        const expectedAuth = process.env.METRICS_AUTH_TOKEN;

        if (!auth || !expectedAuth || auth !== `Bearer ${expectedAuth}`) {
          return res.status(401).json({ error: "Unauthorized" });
        }
      }

      const stats = getPerformanceStats();
      const dbHealth = await database.ping();

      res.status(200).json({
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbHealth,
        performance: stats,
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          cpuUsage: process.cpuUsage(),
          memoryUsage: process.memoryUsage(),
        },
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Main API routes
  app.post("/api/login", (req, res, next) => {
    req.url = "/login";
    authRoutes(req, res, next);
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/verification", digilockerRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/bookings", bookingsRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/test-ai", testAIRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/stats", statsRoutes);
  app.use("/api", notificationsRoutes);
  app.use("/api/support", supportRoutes);
  app.use("/api/courses", coursesRoutes);
  app.use("/api/workers", workersRoutes);
  app.use("/api/discovery", discoveryRoutes);

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Serve static files from public directory
  app.use(express.static("public"));

  // In production, serve the built React app
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist/spa"));

    // Handle client-side routing - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.resolve("dist/spa/index.html"));
      } else {
        res.status(404).json({ success: false, message: `Route ${req.path} not found` });
      }
    });
  }

  // 404 handler for API routes only
  app.use("/api/*", notFound);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

// Start server with proper MongoDB connection
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB FIRST
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    // Create and start Express server
    const app = await createServer();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || "not configured"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server
startServer();
