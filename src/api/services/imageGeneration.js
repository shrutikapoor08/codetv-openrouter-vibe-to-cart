import { OpenRouter } from "@openrouter/sdk";
import { MOCK_MODE, OPENROUTER_API_KEY } from "../config/env.js";

// Initialize OpenRouter client (lazy initialization to avoid crashes if key is missing)
let client = null;
const getClient = () => {
  if (!client && OPENROUTER_API_KEY) {
    client = new OpenRouter({
      apiKey: OPENROUTER_API_KEY,
    });
  }
  return client;
};

// Mock base64 image response (tiny 1x1 pixel transparent PNG)
const MOCK_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const mockImageResponses = {
  default: `data:image/png;base64,${MOCK_IMAGE_BASE64}`,
};

/**
 * Generate an image from a vibe description using OpenRouter's Nano Banana model
 * @param {string} vibeDescription - The user's vibe text
 * @param {object} options - Optional configuration
 * @param {string} options.aspectRatio - Image aspect ratio (e.g., "1:1", "16:9", "9:16")
 * @returns {Promise<{imageUrl: string, prompt: string}>}
 */
export const generateVibeImage = async (vibeDescription, options = {}) => {
  // Mock mode - return mock image without API calls
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Returning mock image without API calls");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    return {
      imageUrl: mockImageResponses.default,
      prompt: vibeDescription,
      message: "Mock image generated successfully (mock mode enabled)",
    };
  }

  try {
    const { aspectRatio = "1:1" } = options;

    // Create a clothing/fashion-focused prompt (single image per request)
    const enhancedPrompt = `Create a professional product photo of a stylish clothing item or fashion accessory that matches this vibe: "${vibeDescription}". Show a clear, well-lit clothing product like a dress, jacket, shoes, bag, sunglasses, or fashion accessory. Make it look like a high-quality e-commerce product photo with the item centered against a clean or complementary background. The clothing/accessory should be the main focus and easily identifiable.`;

    console.log("🎨 Generating image with Nano Banana...");
    console.log("Prompt:", enhancedPrompt);
    console.log("Aspect Ratio:", aspectRatio);

    // Prepare the request configuration
    const requestBody = {
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: enhancedPrompt,
            },
          ],
        },
      ],
    };

    // Add aspect ratio configuration if specified
    if (aspectRatio !== "1:1") {
      requestBody.image_config = {
        aspect_ratio: aspectRatio,
      };
    }

    // Make direct API call (SDK doesn't properly support image generation yet)
    console.log("📤 Sending request to OpenRouter...");
    console.log("Request config:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(
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
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenRouter API error:", response.status, errorText);
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ Image generation response received");
    console.log("Response structure:", JSON.stringify(data, null, 2).substring(0, 500));

    // Extract the image from the response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const message = data.choices[0].message;

      // Check for images in the response
      if (message.images && message.images.length > 0) {
        const imageUrl = message.images[0].image_url.url;

        console.log("🖼️ Image generated successfully!");

        return {
          imageUrl,
          prompt: enhancedPrompt,
          originalVibe: vibeDescription,
          aspectRatio,
          message: message.content || "Image generated successfully",
        };
      } else if (message.content) {
        // Sometimes the model might respond with text instead of an image
        console.warn(
          "⚠️ Model returned text instead of image:",
          message.content
        );
        throw new Error(
          "Model did not generate an image. Try a more descriptive prompt."
        );
      }
    }

    throw new Error("Unexpected response format from OpenRouter");
  } catch (error) {
    console.error("❌ Error in generateVibeImage:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Generate multiple images with different aspect ratios
 * @param {string} vibeDescription - The user's vibe text
 * @returns {Promise<Array>}
 */
export const generateMultipleVibeImages = async (vibeDescription) => {
  const aspectRatios = ["1:1", "16:9", "9:16"];

  console.log(
    `🎨 Generating ${aspectRatios.length} images with different aspect ratios...`
  );

  try {
    const imagePromises = aspectRatios.map((ratio) =>
      generateVibeImage(vibeDescription, { aspectRatio: ratio })
    );

    const results = await Promise.allSettled(imagePromises);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failed = results.filter((result) => result.status === "rejected");

    if (failed.length > 0) {
      console.warn(`⚠️ ${failed.length} image generation(s) failed`);
    }

    return successful;
  } catch (error) {
    console.error("Error generating multiple images:", error);
    throw error;
  }
};

/**
 * Generate 4 different image variants for the same vibe
 * Makes 4 separate API calls with the same vibe to get different variations
 * @param {string} vibeDescription - The user's vibe text
 * @param {object} options - Optional configuration
 * @returns {Promise<Array>}
 */
export const generate4ImageVariants = async (vibeDescription, options = {}) => {
  console.log(`🎨 Generating 4 image variants for: "${vibeDescription}"`);

  try {
    // Make 4 parallel API calls with the same vibe (model will naturally vary outputs)
    const imagePromises = Array(4).fill(null).map(() =>
      generateVibeImage(vibeDescription, options)
    );

    const results = await Promise.allSettled(imagePromises);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failed = results.filter((result) => result.status === "rejected");

    if (failed.length > 0) {
      console.warn(`⚠️ ${failed.length} out of 4 image generation(s) failed`);
      failed.forEach((f, i) => {
        console.error(`  Variant ${i + 1} error:`, f.reason?.message || f.reason);
      });
    }

    console.log(`✅ Successfully generated ${successful.length} out of 4 images`);
    return successful;
  } catch (error) {
    console.error("Error generating 4 image variants:", error);
    throw error;
  }
};

export default generateVibeImage;
