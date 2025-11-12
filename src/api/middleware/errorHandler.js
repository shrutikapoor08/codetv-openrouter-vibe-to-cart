/**
 * Centralized error handling middleware
 * Catches errors from async route handlers and formats consistent error responses
 */

/**
 * Wraps async route handlers to catch errors and pass to error middleware
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 * Should be registered last in middleware chain
 */
export const errorHandler = (error, req, res, next) => {
  console.error("❌ Error:", error.message);
  
  // Check if response already sent
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    error: error.message,
    type: error.constructor.name,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
