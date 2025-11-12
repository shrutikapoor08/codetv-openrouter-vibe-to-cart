import webSearchAgent from "../services/aiAgent.js";
import { generateVibeImage } from "../services/imageGeneration.js";
import {
  getCachedImagePath,
  saveProductImage,
} from "../services/imageService.js";
import { getCachedVibe, cacheVibe } from "../services/vibeService.js";

/**
 * GET /api/vibe
 * Main endpoint for vibe-based product recommendations with optional image generation
 */
export const getVibeProducts = async (req, res) => {
  const vibe = req.validatedVibe; // Set by validateVibeInput middleware
  const roastMode = req.query.mode === "roast";
  const generateImages = req.query.generateImages !== "false"; // Default true

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

  // Generate 1 image for the vibe if requested (much faster!)
  if (generateImages && Array.isArray(products)) {
    console.log(`🖼️  Generating 1 image for vibe: "${vibe}"`);

    try {
      // Generate just ONE image for speed - all products will share it
      const imageResult = await generateVibeImage(vibe, {
        aspectRatio: "1:1",
      });

      console.log(`✅ Generated image successfully`);

      // Create multiple references to the same image (one per product)
      const images = products.map((_, index) => ({
        id: index + 1,
        url: imageResult.imageUrl,
        prompt: imageResult.prompt,
      }));

      // Attach all images to the response
      const response = {
        products,
        images,
        vibe,
      };

      return res.json(response);
    } catch (error) {
      console.error(`❌ Failed to generate image for vibe:`, error.message);
      // Return products without images on error
      return res.json({ products, images: [], vibe });
    }
  }

  res.json(products);
};
