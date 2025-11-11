import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import webSearchAgent from './agent.js'

// Configuration
dotenv.config({ path: ".env.local" });


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
const description = "Where is San Jose?"
    const response = await webSearchAgent({ description });
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
    console.log('Server returned /')
  res.sendFile(path.join(__dirname, "index.html"));
});
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
