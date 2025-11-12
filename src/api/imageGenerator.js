import "dotenv/config";

// Fix for self-signed certificate issues (development only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Mock mode - set MOCK_MODE=true in .env.local to use mock responses
const MOCK_MODE = process.env.MOCK_MODE === "true";

// Mock base64 image response (tiny 1x1 pixel transparent PNG)
const MOCK_IMAGE_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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

    // Create an enhanced prompt that incorporates the vibe
    const enhancedPrompt = `Create a vibrant, visually striking image that captures the essence of this vibe: "${vibeDescription}". Make it bold, creative, and fun with saturated colors and dynamic composition.`;

    console.log("🎨 Generating image with Nano Banana...");
    console.log("Prompt:", enhancedPrompt);
    console.log("Aspect Ratio:", aspectRatio);

    // Prepare the request body for OpenRouter's image generation
    const requestBody = {
      model: "google/gemini-2.5-flash-image", // Nano Banana model
      messages: [
        {
          role: "user",
          content: enhancedPrompt,
        },
      ],
      modalities: ["image", "text"], // Required for image generation
      max_tokens: 1000,
    };

    // Add aspect ratio configuration if specified
    if (aspectRatio !== "1:1") {
      requestBody.image_config = {
        aspect_ratio: aspectRatio,
      };
    }

    // Make the API request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
        "X-Title": "Vibe to Cart - Image Generation",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Image generation response received");

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
        console.warn("⚠️ Model returned text instead of image:", message.content);
        throw new Error("Model did not generate an image. Try a more descriptive prompt.");
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

  console.log(`🎨 Generating ${aspectRatios.length} images with different aspect ratios...`);

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

export default generateVibeImage;
