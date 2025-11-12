import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import webSearchAgent from "./agent.js";
import { validateAPIKeys } from "./validation.js";

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
      roastMode: roastMode 
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
