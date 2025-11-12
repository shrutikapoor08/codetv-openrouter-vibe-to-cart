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
    console.log("🔍 Analyzing image with Nano Banana for clothing details...");

    const requestConfig = {
      model: "google/gemini-2.5-flash-image", // Nano Banana - Google's fast vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a fashion expert analyzing clothing and outfit images. Carefully examine this image and identify ALL visible clothing items and accessories.

For EACH clothing item you see, provide:
- type: Specific clothing type (jacket, dress, pants, shirt, t-shirt, sweater, coat, shoes, boots, sneakers, bag, purse, sunglasses, hat, scarf, belt, jewelry, watch, etc.)
- color: The primary color (be specific: navy blue, charcoal gray, cream, burgundy, etc.)
- style: Detailed style description (leather biker, vintage denim, minimalist, oversized, fitted, distressed, etc.)

Guidelines:
- List items from top to bottom (headwear → upper body → lower body → footwear → accessories)
- Be specific and detailed in your descriptions
- If you see patterns (stripes, plaid, floral), mention them in the style
- Include material types if visible (cotton, wool, leather, silk, etc.)

Provide a brief 1-2 sentence summary describing the overall outfit aesthetic.

Output ONLY valid JSON in this EXACT format (no markdown, no code blocks, just raw JSON):
{
  "items": [
    {"type": "leather jacket", "color": "black", "style": "classic biker with silver zippers"},
    {"type": "jeans", "color": "dark indigo", "style": "slim-fit distressed denim"},
    {"type": "sneakers", "color": "white", "style": "minimalist low-top canvas"}
  ],
  "summary": "A classic edgy street style look combining rugged leather with casual denim."
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

      console.log("📝 Parsing response:", content.substring(0, 200) + "...");

      // Parse the JSON response
      const analysis = JSON.parse(content);

      console.log("👔 Clothing items identified:", analysis.items.length);
      console.log("   Items:", analysis.items.map(i => i.type).join(", "));

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
