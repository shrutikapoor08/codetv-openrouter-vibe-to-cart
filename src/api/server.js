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
  next();
});

// Routes
app.get("/agent", async (req, res) => {
  try {
    // Accept query from query parameter or request body
    const description =
      req.query.query || req.body.query || "Where is San Jose?";

    if (!description || description.trim() === "") {
      return res.status(400).json({
        error: "Query parameter is required. Use ?query=your-question",
      });
    }

    console.log("Starting agent with description:", description);

    const response = await webSearchAgent({ description });
    console.log("Agent response:", response);

    res.send(response);
  } catch (error) {
    console.error("Agent error:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
      details: error.toString(),
    });
  }
});

app.get("/", (req, res) => {
  console.log("Server returned /");

  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
