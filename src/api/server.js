import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import webSearchAgent from "./agent.js";
import { validateAPIKeys } from "./validation.js";
import { generateVibeImage, generateMultipleVibeImages } from "./imageGenerator.js";

// Configuration
dotenv.config({ path: [".env.local", ".env"] });

// Validate API keys before starting the server
validateAPIKeys();

const app = express();
const port = process.env.PORT || 3001;
const __dirname = path.resolve(path.dirname(""));

// Middleware
app.use(express.json({ strict: false }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes
app.get("/api/vibe", async (req, res) => {
  try {
    const vibe = req.query.query || req.query.vibe;
    const roastMode = req.query.mode === "roast";

    if (!vibe || vibe.trim() === "") {
      return res.status(400).json({
        error:
          "Vibe parameter is required. Use ?query=your-vibe or ?vibe=your-vibe",
      });
    }

    const response = await webSearchAgent({
      description: vibe,
      roastMode: roastMode,
    });

    // Parse the JSON string response and send as proper JSON
    const products = JSON.parse(response);
    res.json(products);
  } catch (error) {
    console.error("❌ Vibe processing error:", error.message);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
    });
  }
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
