/**
 * Input validation middleware and utilities
 */

/**
 * Validates vibe input from query parameters or body
 * Supports both 'vibe' and 'query' parameter names for backward compatibility
 * @returns {Function} Express middleware function
 */
export const validateVibeInput = () => {
  return (req, res, next) => {
    // Safety check for req object
    if (!req || !req.query) {
      console.error("❌ Validator error: req or req.query is undefined");
      return res.status(500).json({
        error: "Internal server error: Invalid request object",
      });
    }

    // Support both 'vibe' and 'query' parameters for backward compatibility
    const vibe = req.query.vibe || req.query.query || req.body.vibe || req.body.query;

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error: "vibe or query parameter is required. Example: ?vibe=villain+era",
      });
    }

    // Attach validated vibe to request for use in route handler
    req.validatedVibe = vibe.trim();
    next();
  };
};

/**
 * Validates product image generation input
 */
export const validateProductImageInput = (req, res, next) => {
  const { productName, productReason } = req.body;

  if (!productName || !productReason) {
    return res.status(400).json({
      error: "Product name and reason are required",
    });
  }

  next();
};
