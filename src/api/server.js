import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import webSearchAgent from "./agent.js";
import { validateAPIKeys } from "./validation.js";
import { generateVibeImage, generateMultipleVibeImages } from "./imageGenerator.js";
import { getCachedImagePath, saveProductImage, getCacheStats } from "./productImageCache.js";
import { getCachedVibe, cacheVibe, clearVibeCache, getVibeCacheStats } from "./vibeCache.js";

// Configuration
dotenv.config({ path: [".env.local", ".env"] });

// Validate API keys before starting the server
validateAPIKeys();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json({ strict: false }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../../public")));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Routes
app.get("/api/vibe", async (req, res) => {
  try {
    const vibe = req.query.query || req.query.vibe;
    const roastMode = req.query.mode === "roast";
    const generateImages = req.query.generateImages !== "false"; // Default true

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error:
          "Vibe parameter is required. Use ?query=your-vibe or ?vibe=your-vibe",
      });
    }

    // Check if we have cached products for this vibe
    let products = getCachedVibe(vibe, roastMode);
    
    if (!products) {
      // Generate new products
      console.log(`🤖 Generating new products for vibe: "${vibe}"`);
      const response = await webSearchAgent({
        description: vibe,
        roastMode: roastMode,
      });

      // Parse the JSON string response
      products = JSON.parse(response);
      
      // Cache the products for next time
      cacheVibe(vibe, roastMode, products);
    }

    // Generate images for products if requested
    if (generateImages && Array.isArray(products)) {
      console.log(`🖼️  Processing images for ${products.length} products...`);
      
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          try {
            // Check if cached image exists
            let imagePath = getCachedImagePath(product.name, product.reason);
            
            if (!imagePath) {
              // Generate new image
              console.log(`  🎨 Generating image for: ${product.name}`);
              const imagePrompt = `${product.emoji} ${product.name}: ${product.reason}`;
              
              const result = await generateVibeImage(imagePrompt, { 
                aspectRatio: "1:1" 
              });
              
              // Save to disk
              imagePath = saveProductImage(product.name, product.reason, result.imageUrl);
            } else {
              console.log(`  ✅ Using cached image for: ${product.name}`);
            }
            
            console.log(`  📤 Product "${product.name}" → image: ${imagePath || 'NONE'}`);
            
            return {
              ...product,
              image: imagePath,
            };
          } catch (error) {
            console.error(`  ❌ Failed to generate image for ${product.name}:`, error.message);
            // Return product without image on error
            return product;
          }
        })
      );
      
      console.log(`📦 Sending ${productsWithImages.length} products to client`);
      productsWithImages.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - image: ${p.image ? '✅' : '❌'}`);
      });
      
      return res.json(productsWithImages);
    }

    res.json(products);
  } catch (error) {
    console.error("❌ Vibe processing error:", error.message);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
    });
  }
});

// Generate Product Image endpoint - Generate image for a specific product with caching
app.post("/api/product-image", async (req, res) => {
  try {
    const { productName, productReason, emoji } = req.body;

    if (!productName || !productReason) {
      return res.status(400).json({
        error: "Product name and reason are required",
      });
    }

    // Check if cached image exists
    const cachedPath = getCachedImagePath(productName, productReason);
    if (cachedPath) {
      console.log(`✅ Using cached image for: ${productName}`);
      return res.json({
        success: true,
        cached: true,
        imagePath: cachedPath,
        productName,
      });
    }

    // Generate new image
    console.log(`🎨 Generating new image for product: ${productName}`);
    
    // Create a detailed prompt for the product
    const imagePrompt = `${emoji} ${productName}: ${productReason}`;
    
    const result = await generateVibeImage(imagePrompt, { 
      aspectRatio: "1:1" 
    });

    // Save to disk
    const imagePath = saveProductImage(productName, productReason, result.imageUrl);

    res.json({
      success: true,
      cached: false,
      imagePath,
      productName,
      generatedPrompt: result.prompt,
    });
  } catch (error) {
    console.error("Product image generation error:", error);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
    });
  }
});

// Cache statistics endpoint
app.get("/api/image-cache-stats", (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});

// Vibe cache statistics endpoint
app.get("/api/vibe-cache-stats", (req, res) => {
  const stats = getVibeCacheStats();
  res.json(stats);
});

// Clear vibe cache endpoint
app.post("/api/clear-vibe-cache", (req, res) => {
  clearVibeCache();
  res.json({ success: true, message: "Vibe cache cleared" });
});

// Vibe to Image endpoint - Generate a single image from vibe
app.post("/vibe-to-image", async (req, res) => {
  try {
    const vibe = req.body.vibe || req.query.vibe;

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error: "Vibe parameter is required. Send as JSON body or query parameter.",
      });
    }

    const aspectRatio = req.body.aspectRatio || req.query.aspectRatio || "1:1";

    console.log(`🎨 Generating image for vibe: "${vibe}" with aspect ratio: ${aspectRatio}`);

    const result = await generateVibeImage(vibe, { aspectRatio });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Vibe to image error:", error);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
      details: error.toString(),
    });
  }
});

// Vibe to Images endpoint - Generate multiple images with different aspect ratios
app.post("/vibe-to-images", async (req, res) => {
  try {
    const vibe = req.body.vibe || req.query.vibe;

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error: "Vibe parameter is required. Send as JSON body or query parameter.",
      });
    }

    console.log(`🎨 Generating multiple images for vibe: "${vibe}"`);

    const results = await generateMultipleVibeImages(vibe);

    res.json({
      success: true,
      count: results.length,
      images: results,
    });
  } catch (error) {
    console.error("Vibe to images error:", error);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
      details: error.toString(),
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`   http://localhost:${port}`);
  if (process.env.MOCK_MODE === "true") {
    console.log("   🎭 MOCK MODE enabled");
  }
});
