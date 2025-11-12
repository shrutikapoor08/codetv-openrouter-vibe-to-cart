import { generateVibeImage } from "../imageGenerator.js";
import { getCachedImagePath, saveProductImage } from "../productImageCache.js";

/**
 * POST /api/product-image
 * Generate image for a specific product with caching
 */
export const generateProductImage = async (req, res) => {
  const { productName, productReason, emoji } = req.body;

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
    aspectRatio: "1:1",
  });

  // Save to disk
  const imagePath = saveProductImage(
    productName,
    productReason,
    result.imageUrl
  );

  res.json({
    success: true,
    cached: false,
    imagePath,
    productName,
    generatedPrompt: result.prompt,
  });
};
