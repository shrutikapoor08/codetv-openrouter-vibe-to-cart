import analyzeImageForClothing from "../services/imageAnalysis.js";

/**
 * POST /api/analyze-image
 * Analyze an image to extract clothing details
 */
export const analyzeImage = async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  console.log(`🔍 Analyzing image for clothing details...`);

  try {
    const analysis = await analyzeImageForClothing(imageUrl);
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      message: error.message,
    });
  }
};
