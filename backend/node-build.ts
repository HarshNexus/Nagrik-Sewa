import dotenv from "dotenv";
import { createServer } from "./index";
import { database } from "./config/database";

dotenv.config();

const port = Number(process.env.PORT || 5000);

async function bootstrap() {
  const app = await createServer();
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || "not configured"}`);
    console.log("API ready on /api");
  });

  const shutdown = async (signal: string, code = 0) => {
    console.log(`Received ${signal}, shutting down gracefully`);

    server.close(async (serverError) => {
      if (serverError) {
        console.error('Error closing HTTP server:', serverError);
      }

      try {
        await database.disconnect();
      } catch (dbError) {
        console.error('Error during MongoDB disconnect:', dbError);
      } finally {
        process.exit(code);
      }
    });
  };

  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.once("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    void shutdown("uncaughtException", 1);
  });

  process.once("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    void shutdown("unhandledRejection", 1);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
