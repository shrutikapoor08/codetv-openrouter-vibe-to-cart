import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { validateAPIKeys } from "./validation.js";

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

// Configuration
dotenv.config({ path: [".env.local", ".env"] });

// Validate API keys before starting the server
validateAPIKeys();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(express.json({ strict: false }));
app.use(express.static(path.join(__dirname, "../../public")));
app.use(corsMiddleware);

// Routes
app.get(
  "/api/vibe",
  validateVibeInput("query"),
  asyncHandler(getVibeProducts)
);

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
