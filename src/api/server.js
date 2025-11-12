import express from "express";
import path from "path";
import { getDirname } from "./utils/paths.js";
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
import { getVibeProducts } from "./routes/vibeRoutes.js";
import { generateProductImage } from "./routes/imageRoutes.js";
import {
  getImageCacheStats,
  getVibeCacheStatsRoute,
  clearVibeCacheRoute,
} from "./routes/cacheRoutes.js";

// Validate API keys before starting the server
validateAPIKeys();

const __dirname = getDirname(import.meta.url);

const app = express();
const port = PORT;

// Middleware setup
app.use(express.json({ strict: false }));
app.use(express.static(path.join(__dirname, "../../public")));
app.use(corsMiddleware);

// Routes
app.get("/api/vibe", validateVibeInput("vibe"), asyncHandler(getVibeProducts));

app.post(
  "/api/product-image",
  validateProductImageInput,
  asyncHandler(generateProductImage)
);

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

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`   http://localhost:${port}`);
  if (process.env.MOCK_MODE === "true") {
    console.log("   🎭 MOCK MODE enabled");
  }
});
