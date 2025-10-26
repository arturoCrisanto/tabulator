/**
 * Server utility functions for handling server startup and graceful shutdown
 */

/**
 * Sets up graceful shutdown handlers for the application
 */
export const setupGracefulShutdown = () => {
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
};

/**
 * Starts the Express server with proper logging
 * @param {Object} app - Express application instance
 * @param {number} PORT - Port number to listen on
 * @param {string} NODE_ENV - Node environment (development/production)
 */
export const startServer = (app, PORT, NODE_ENV) => {
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
};
