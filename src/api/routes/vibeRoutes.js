import webSearchAgent from "../services/aiAgent.js";
import { generate4ImageVariants } from "../services/imageGeneration.js";
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

  // Generate 4 images for the vibe if requested
  if (generateImages && Array.isArray(products)) {
    console.log(`🖼️  Generating 4 images for vibe: "${vibe}"`);

    try {
      // Generate 4 different image variants for this vibe
      const imageResults = await generate4ImageVariants(vibe, {
        aspectRatio: "1:1",
      });

      console.log(`✅ Generated ${imageResults.length} images successfully`);

      // Attach all images to the response
      const response = {
        products,
        images: imageResults.map((result, index) => ({
          id: index + 1,
          url: result.imageUrl,
          prompt: result.prompt,
        })),
        vibe,
      };

      return res.json(response);
    } catch (error) {
      console.error(`❌ Failed to generate images for vibe:`, error.message);
      // Return products without images on error
      return res.json({ products, images: [], vibe });
    }
  }

  res.json(products);
};
