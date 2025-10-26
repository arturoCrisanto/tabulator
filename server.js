import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import apiInfoRoutes from "./routes/apiInfoRoutes.js";
import { setupGracefulShutdown, startServer } from "./utils/serverUtils.js";

dotenv.config();
connectDB();
const app = express();

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
app.use("/api", apiInfoRoutes);

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

startServer(app, PORT, NODE_ENV);
setupGracefulShutdown();

export default app;
