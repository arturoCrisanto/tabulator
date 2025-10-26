import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import adminRoutes from "./routes/adminRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("combined"));

// Custom JSON parsing with better error handling
app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Custom error handler for JSON parsing errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error("JSON Parse Error:", error.message);
    console.error("Request body:", req.body);
    console.error("Request headers:", req.headers);
    return res.status(400).json({
      error: "Invalid JSON format",
      message:
        "The request body contains malformed JSON. Please check your JSON syntax.",
      details: error.message,
    });
  }
  next(error);
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "🎯 Tabulator API Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/votes", voteRoutes);

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "Tabulator API",
    version: "1.0.0",
    endpoints: {
      admin: {
        auth: [
          "POST /api/admin/register - Register admin",
          "POST /api/admin/login - Admin login",
        ],
        dashboard: ["GET /api/admin/dashboard - Get dashboard stats"],
        events: [
          "GET /api/admin/events - Get all events",
          "POST /api/admin/events - Create event",
          "GET /api/admin/events/:id - Get single event",
          "PUT /api/admin/events/:id - Update event",
          "DELETE /api/admin/events/:id - Delete event",
        ],
        categories: [
          "GET /api/admin/events/:eventId/categories - Get categories",
          "POST /api/admin/events/:eventId/categories - Add category",
          "PUT /api/admin/events/:eventId/categories/:categoryId - Update category",
          "DELETE /api/admin/events/:eventId/categories/:categoryId - Delete category",
        ],
        candidates: [
          "GET /api/admin/events/:eventId/candidates - Get candidates",
          "POST /api/admin/events/:eventId/candidates - Add candidate",
          "PUT /api/admin/events/:eventId/candidates/:candidateId - Update candidate",
          "DELETE /api/admin/events/:eventId/candidates/:candidateId - Delete candidate",
        ],
        judges: [
          "GET /api/admin/events/:eventId/judges - Get judges",
          "POST /api/admin/events/:eventId/judges - Add judge",
          "PUT /api/admin/events/:eventId/judges/:judgeId - Update judge",
          "DELETE /api/admin/events/:eventId/judges/:judgeId - Delete judge",
        ],
      },
      votes: [
        "POST /api/votes - Submit vote",
        "GET /api/votes/ranking/:eventId - Get event ranking",
        "GET /api/votes/judge/:judgeId - Get votes by judge",
        "PUT /api/votes/:voteId - Update vote",
        "DELETE /api/votes/:voteId - Delete vote",
      ],
    },
  });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/api`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `💾 Database: ${
      process.env.MONGO_URI ? "Connected" : "Check MONGO_URI in .env"
    }`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
