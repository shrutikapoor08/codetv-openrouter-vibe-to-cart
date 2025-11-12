import express from "express";
import path from "path";
import dotenv from "dotenv";
import { getDirname } from "./utils/paths.js";

// Load environment variables from .env file
dotenv.config({ path: [".env.local", ".env"] });

import { PORT } from "./config/env.js";
import { validateAPIKeys } from "./config/apiKeyValidation.js";

// Middleware
import { corsMiddleware } from "./middleware/cors.js";
import { asyncHandler, errorHandler } from "./middleware/errorHandler.js";
import {
  validateVibeInput,
  validateProductImageInput,
} from "./middleware/validators.js";

// Route handlers
import { getVibeProducts, getVibeImages, roastCartItems } from "./routes/vibeRoutes.js";
import { generateProductImage } from "./routes/imageRoutes.js";
import {
  getImageCacheStats,
  getVibeCacheStatsRoute,
  clearVibeCacheRoute,
} from "./routes/cacheRoutes.js";
import { analyzeImage } from "./routes/imageAnalysisRoutes.js";

// Validate API keys before starting the server
validateAPIKeys();

const __dirname = getDirname(import.meta.url);

const app = express();
const port = PORT;

// Middleware setup
app.use(express.json({ strict: false, limit: '50mb' })); // Increased limit for data URIs
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, "../../public")));
app.use(corsMiddleware);

// Routes
app.get("/api/vibe-images", validateVibeInput(), asyncHandler(getVibeImages));
app.get("/api/vibe", validateVibeInput(), asyncHandler(getVibeProducts));

app.post("/api/roast-cart", asyncHandler(roastCartItems));

app.post(
  "/api/product-image",
  validateProductImageInput,
  asyncHandler(generateProductImage)
);

// Image analysis route
app.post("/api/analyze-image", asyncHandler(analyzeImage));

// Cache management routes
app.get("/api/image-cache-stats", getImageCacheStats);
app.get("/api/vibe-cache-stats", getVibeCacheStatsRoute);
app.post("/api/clear-vibe-cache", clearVibeCacheRoute);

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start server
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`   http://localhost:${port}`);
  if (process.env.MOCK_MODE === "true") {
    console.log("   🎭 MOCK MODE enabled");
  }
});

// Keep the process alive
server.on("error", (error) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});
