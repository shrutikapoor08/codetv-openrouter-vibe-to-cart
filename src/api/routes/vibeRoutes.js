import webSearchAgent, { roastCart } from "../services/aiAgent.js";
import { generateVibeImage } from "../services/imageGeneration.js";
import {
  getCachedImagePath,
  saveProductImage,
} from "../services/imageService.js";
import { getCachedVibe, cacheVibe } from "../services/vibeService.js";
import {
  getCachedVibeImage,
  cacheVibeImage,
} from "../services/vibeImageCache.js";

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

  // Generate unique images for each product (with caching)
  if (generateImages && Array.isArray(products)) {
    console.log(`🖼️  Checking cache and generating images for vibe: "${vibe}"`);

    try {
      // Generate one unique image for each product (check cache first)
      const imagePromises = products.map(async (product, index) => {
        // Create a unique prompt for each product
        const productPrompt = `${vibe} - ${product.name}: ${product.reason}`;

        // Check if we have a cached image for this exact prompt
        const cachedImage = getCachedVibeImage(productPrompt);
        if (cachedImage) {
          console.log(`   ✅ Using cached image ${index + 1}/${products.length} for: ${product.name}`);
          return cachedImage;
        }

        // Generate new image if not cached
        console.log(`   🎨 Generating new image ${index + 1}/${products.length} for: ${product.name}`);
        const imageResult = await generateVibeImage(productPrompt, {
          aspectRatio: "1:1",
        });

        // Cache the generated image for future use
        cacheVibeImage(productPrompt, imageResult);

        return imageResult;
      });

      // Wait for all images (cached or generated)
      const imageResults = await Promise.all(imagePromises);

      const cachedCount = imageResults.filter((_, i) => getCachedVibeImage(`${vibe} - ${products[i].name}: ${products[i].reason}`)).length;
      console.log(`✅ Retrieved ${imageResults.length} images (${cachedCount} from cache, ${imageResults.length - cachedCount} newly generated)`)

      // Map each image to its corresponding product
      const images = imageResults.map((result, index) => ({
        id: index + 1,
        url: result.imageUrl,
        prompt: result.prompt,
      }));

      // Attach all images to the response
      const response = {
        products,
        images,
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

/**
 * POST /api/roast-cart
 * Roast the user's cart items
 */
export const roastCartItems = async (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "cartItems array is required" });
  }

  if (cartItems.length === 0) {
    return res.json({
      roast: "Your cart is empty, just like your will to commit to anything.",
    });
  }

  try {
    const roast = await roastCart(cartItems);
    res.json({ roast });
  } catch (error) {
    console.error("❌ Error roasting cart:", error);
    res.status(500).json({
      error: "Failed to roast cart",
      roast:
        "I'd roast your cart, but it looks like my AI is having a breakdown.",
    });
  }
};
