import webSearchAgent, { roastCart } from "../services/aiAgent.js";
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

  // Generate images for products if requested
  if (generateImages && Array.isArray(products)) {
    console.log(`🖼️  Processing images for ${products.length} products...`);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        try {
          // Check if cached image exists
          let imagePath = getCachedImagePath(product.name, product.reason);

          if (!imagePath) {
            // Generate new image
            console.log(`  🎨 Generating image for: ${product.name}`);
            const imagePrompt = `${product.emoji} ${product.name}: ${product.reason}`;

            const result = await generateVibeImage(imagePrompt, {
              aspectRatio: "1:1",
            });

            // Save to disk
            imagePath = saveProductImage(
              product.name,
              product.reason,
              result.imageUrl
            );
          } else {
            console.log(`  ✅ Using cached image for: ${product.name}`);
          }

          console.log(
            `  📤 Product "${product.name}" → image: ${imagePath || "NONE"}`
          );

          return {
            ...product,
            image: imagePath,
          };
        } catch (error) {
          console.error(
            `  ❌ Failed to generate image for ${product.name}:`,
            error.message
          );
          // Return product without image on error
          return product;
        }
      })
    );

    console.log(`📦 Sending ${productsWithImages.length} products to client`);
    productsWithImages.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - image: ${p.image ? "✅" : "❌"}`);
    });

    return res.json(productsWithImages);
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
