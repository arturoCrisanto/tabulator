import express from "express";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
  res.json({
    message: "🎯 Tabulator API Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
