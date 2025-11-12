/**
 * Input validation middleware and utilities
 */

/**
 * Validates vibe input from query parameters or body
 * @param {string} fieldName - The field name to check (e.g., 'query', 'vibe')
 * @returns {Function} Express middleware function
 */
export const validateVibeInput = (fieldName = "vibe") => {
  return (req, res, next) => {
    // Safety check for req object
    if (!req || !req.query) {
      console.error("❌ Validator error: req or req.query is undefined");
      return res.status(500).json({
        error: "Internal server error: Invalid request object",
      });
    }

    const vibe = req.query[fieldName] || req.body[fieldName];

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error: `${fieldName} parameter is required. Provide as query parameter or in request body.`,
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
