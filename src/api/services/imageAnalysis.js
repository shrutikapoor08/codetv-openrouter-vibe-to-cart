import { MOCK_MODE, OPENROUTER_API_KEY } from "../config/env.js";

/**
 * Search for a product image using web search
 * @param {Object} item - The clothing item to search for
 * @returns {Promise<string|null>} - Image URL from web search
 */
const searchItemImage = async (item) => {
  if (MOCK_MODE) {
    return "https://via.placeholder.com/300x400?text=" + encodeURIComponent(item.type);
  }

  try {
    // Create a search query optimized for product images
    const searchQuery = `${item.color} ${item.style} ${item.type} product photo`;

    console.log(`📸 Searching for image: "${searchQuery}"`);

    const requestConfig = {
      model: "openai/gpt-4o-mini", // Fast model for web search
      messages: [
        {
          role: "user",
          content: `Find a high-quality product image of a ${item.color} ${item.style} ${item.type}. Return the direct image URL. Look for professional product photography.`,
        },
      ],
      provider: {
        order: ["Perplexity"], // Use Perplexity for web search
        allow_fallbacks: false,
      },
      transforms: ["web_search"], // Enable web search
      max_tokens: 300,
      temperature: 0.3,
    };

    const fetchResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
          "X-Title": "Vibe to Cart - Image Search",
        },
        body: JSON.stringify(requestConfig),
      }
    );

    if (!fetchResponse.ok) {
      console.error(`⚠️ Image search failed for ${item.type}`);
      return null;
    }

    const response = await fetchResponse.json();

    // Extract image URLs from the response
    if (response.choices && response.choices[0]) {
      const content = response.choices[0].message.content;

      // Try to extract image URLs (jpg, jpeg, png, webp)
      const imageUrlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+\.(jpg|jpeg|png|webp|gif)(\?[^\s<>"{}|\\^`\[\]]*)?/gi;
      const imageUrls = content.match(imageUrlRegex);

      if (imageUrls && imageUrls.length > 0) {
        // Return the first image URL found
        const imageUrl = imageUrls[0];
        console.log(`✅ Found image for ${item.type}: ${imageUrl.substring(0, 60)}...`);
        return imageUrl;
      }

      // If no direct image URL, try to extract any URL that might be an image
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      const urls = content.match(urlRegex);

      if (urls && urls.length > 0) {
        // Filter for URLs that might be images
        const potentialImageUrl = urls.find(url =>
          url.includes('image') ||
          url.includes('photo') ||
          url.includes('cdn') ||
          url.includes('img')
        );

        if (potentialImageUrl) {
          console.log(`✅ Found potential image for ${item.type}`);
          return potentialImageUrl;
        }
      }

      console.log(`⚠️ No image URL found for ${item.type}`);
    }

    return null;
  } catch (error) {
    console.error(`❌ Error searching for image of ${item.type}:`, error.message);
    return null;
  }
};

/**
 * Search for shopping links for a clothing item using OpenRouter web search
 * @param {Object} item - The clothing item to search for
 * @returns {Promise<Array>} - Array of shopping links
 */
const searchClothingItem = async (item) => {
  if (MOCK_MODE) {
    return [
      {
        title: `Shop ${item.type}`,
        url: "https://example.com",
        snippet: `Find the perfect ${item.color} ${item.style} ${item.type}`,
      },
    ];
  }

  try {
    // Create a search query from the item details
    const searchQuery = `shop ${item.color} ${item.style} ${item.type} buy online`;

    console.log(`🔍 Searching for: "${searchQuery}"`);

    const requestConfig = {
      model: "openai/gpt-4o-mini", // Fast model for web search
      messages: [
        {
          role: "user",
          content: `Find the best online shopping options for: ${item.color} ${item.style} ${item.type}. Return the top 3 most relevant shopping links.`,
        },
      ],
      provider: {
        order: ["Perplexity"], // Use Perplexity for web search
        allow_fallbacks: false,
      },
      transforms: ["web_search"], // Enable web search
      max_tokens: 500,
      temperature: 0.3,
    };

    const fetchResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
          "X-Title": "Vibe to Cart - Web Search",
        },
        body: JSON.stringify(requestConfig),
      }
    );

    if (!fetchResponse.ok) {
      console.error(`⚠️ Web search failed for ${item.type}`);
      return [];
    }

    const response = await fetchResponse.json();

    // Extract search results from the response
    if (response.choices && response.choices[0]) {
      const content = response.choices[0].message.content;

      // Try to extract URLs from the content
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      const urls = content.match(urlRegex) || [];

      // Create shopping links from found URLs
      const links = urls.slice(0, 3).map((url, index) => ({
        title: `Shop ${item.type} - Option ${index + 1}`,
        url: url,
        snippet: `${item.color} ${item.style} ${item.type}`,
      }));

      console.log(`✅ Found ${links.length} shopping links for ${item.type}`);
      return links;
    }

    return [];
  } catch (error) {
    console.error(`❌ Error searching for ${item.type}:`, error.message);
    return [];
  }
};

/**
 * Analyze an image to extract clothing details using AI vision
 * @param {string} imageUrl - The image URL (can be data URI or regular URL)
 * @returns {Promise<Object>} - Parsed clothing details
 */
export const analyzeImageForClothing = async (imageUrl) => {
  // Mock mode - return mock clothing details
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Returning mock clothing analysis");
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      items: [
        { type: "jacket", color: "black", style: "leather" },
        { type: "pants", color: "blue", style: "denim" },
        { type: "shoes", color: "white", style: "sneakers" },
      ],
      summary: "A stylish black leather jacket paired with blue denim pants and white sneakers.",
    };
  }

  try {
    console.log("🍌 Analyzing image with Nano Banana (google/gemini-2.5-flash-image) for clothing details...");

    const requestConfig = {
      model: "google/gemini-2.5-flash-image", // Nano Banana - Google's fast vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert fashion stylist analyzing clothing and outfit images. Carefully examine this image and identify EVERY SINGLE visible clothing item and accessory.

CLOTHING ITEMS TO LOOK FOR:
- Headwear: hat, cap, beanie, tiara, crown, headband, turban
- Upper body: dress, top, shirt, blouse, t-shirt, tank top, sweater, cardigan, jacket, blazer, coat, hoodie, vest
- Lower body: pants, jeans, shorts, skirt, leggings, tights
- Footwear: shoes, boots, sneakers, heels, sandals, flats, slippers, socks
- Accessories: purse, bag, handbag, clutch, backpack, tote, belt, scarf, necklace, earrings, bracelet, ring, watch, sunglasses, glasses, gloves

For EACH item you identify, provide:
- type: Exact clothing type (be specific: "maxi dress" not just "dress", "ankle boots" not just "boots")
- color: Precise color description (burgundy, navy blue, emerald green, rose gold, etc.)
- style: Detailed style with materials and patterns (sequined, embroidered, silk, velvet, floral print, geometric pattern, etc.)

IMPORTANT INSTRUCTIONS:
1. List ALL items visible in the image, no matter how small
2. Order: headwear → upper body → lower body → footwear → accessories
3. Be extremely detailed and specific
4. If you see jewelry, identify the type (necklace, earrings, bracelet, ring)
5. If you see bags, specify the type (purse, handbag, clutch, tote, backpack)
6. Include all visible accessories like belts, scarves, hats, tiaras

Provide a 1-2 sentence summary of the overall outfit aesthetic.

Return ONLY raw JSON (no markdown, no code blocks):
{
  "items": [
    {"type": "tiara", "color": "silver", "style": "crystal-encrusted royal crown"},
    {"type": "maxi dress", "color": "emerald green", "style": "flowing silk evening gown with sequins"},
    {"type": "clutch purse", "color": "gold", "style": "metallic evening bag with chain strap"},
    {"type": "heels", "color": "nude", "style": "strappy stiletto sandals"}
  ],
  "summary": "An elegant royal-inspired evening look with luxurious fabrics and sparkling accessories."
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      modalities: ["image", "text"], // Required for Nano Banana image processing
      max_tokens: 1000, // Increased for more detailed analysis
      temperature: 0.2, // Lower temperature for more consistent parsing
    };

    const fetchResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
          "X-Title": "Vibe to Cart",
        },
        body: JSON.stringify(requestConfig),
      }
    );

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error(
        "❌ OpenRouter API error:",
        fetchResponse.status,
        errorText
      );
      throw new Error(
        `OpenRouter API error: ${fetchResponse.status} - ${errorText}`
      );
    }

    const response = await fetchResponse.json();
    console.log("✅ Nano Banana analysis response received");

    // Extract the analysis from the response
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      let content = response.choices[0].message.content;

      // Clean up the response - remove markdown code blocks if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

      console.log("📝 Raw Nano Banana response:", content.substring(0, 300) + "...");

      // Parse the JSON response
      const analysis = JSON.parse(content);

      console.log("👔 Clothing items identified by Nano Banana:", analysis.items.length);
      console.log("   Detailed items:");
      analysis.items.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.type} - ${item.color} - ${item.style}`);
      });

      // Search for images and shopping links for each item (in parallel)
      console.log("🛍️  Searching for product images and shopping links...");
      const itemsWithExtras = await Promise.all(
        analysis.items.map(async (item) => {
          // Run image search and shopping search in parallel for each item
          const [imageUrl, shoppingLinks] = await Promise.all([
            searchItemImage(item),
            searchClothingItem(item),
          ]);

          return {
            ...item,
            imageUrl,
            shoppingLinks,
          };
        })
      );

      console.log("✅ Added images and shopping links to all items");

      return {
        ...analysis,
        items: itemsWithExtras,
      };
    }

    throw new Error("Unexpected response format from OpenRouter");
  } catch (error) {
    console.error("❌ Error in analyzeImageForClothing:", error);

    // Return a fallback response instead of throwing
    return {
      items: [
        { type: "clothing item", color: "various", style: "fashionable" },
      ],
      summary: "Unable to parse specific clothing details, but the image shows fashionable clothing items.",
      error: error.message,
    };
  }
};

export default analyzeImageForClothing;
