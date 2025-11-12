import analyzeImageForClothing from "../services/imageAnalysis.js";
import {
  getCachedImageAnalysis,
  cacheImageAnalysis,
} from "../services/imageAnalysisCache.js";

/**
 * POST /api/analyze-image
 * Analyze an image to extract clothing details (with caching)
 */
export const analyzeImage = async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  console.log(`🔍 Analyzing image for clothing details...`);

  try {
    // Check cache first
    const cachedAnalysis = getCachedImageAnalysis(imageUrl);
    if (cachedAnalysis) {
      return res.json(cachedAnalysis);
    }

    // Not in cache - perform analysis
    console.log(`🍌 No cache found. Analyzing with Nano Banana...`);
    const analysis = await analyzeImageForClothing(imageUrl);

    // Cache the result for future requests
    cacheImageAnalysis(imageUrl, analysis);

    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      message: error.message,
    });
  }
};
