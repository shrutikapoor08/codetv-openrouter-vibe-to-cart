import { MOCK_MODE, OPENROUTER_API_KEY } from "../config/env.js";

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
    console.log("🔍 Analyzing image for clothing details...");

    const requestConfig = {
      model: "openai/gpt-4o-mini", // Vision-capable model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this fashion/clothing image and identify all clothing items and accessories visible.

For each item, provide:
- type: The type of clothing (e.g., jacket, dress, pants, shirt, shoes, bag, sunglasses, hat, etc.)
- color: The primary color
- style: A brief style description (e.g., leather, denim, formal, casual, etc.)

Also provide a brief summary sentence describing the overall outfit/items.

Respond ONLY with valid JSON in this exact format:
{
  "items": [
    {"type": "jacket", "color": "black", "style": "leather"},
    {"type": "pants", "color": "blue", "style": "denim"}
  ],
  "summary": "A brief description of the outfit"
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
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent parsing
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
    console.log("✅ Image analysis response received");

    // Extract the analysis from the response
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      const content = response.choices[0].message.content;

      // Parse the JSON response
      const analysis = JSON.parse(content);

      console.log("👔 Clothing items identified:", analysis.items.length);

      return analysis;
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
