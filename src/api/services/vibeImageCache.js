import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PATHS } from "../utils/paths.js";

// Path to cache directory
const CACHE_DIR = PATHS.CACHE_DIR;
const IMAGE_CACHE_FILE = path.join(CACHE_DIR, "vibe-images.json");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Initialize cache file if it doesn't exist
if (!fs.existsSync(IMAGE_CACHE_FILE)) {
  fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify({}), "utf8");
}

/**
 * Generate a cache key for an image prompt
 * @param {string} prompt - The image generation prompt
 * @returns {string} - MD5 hash of the prompt
 */
function generateCacheKey(prompt) {
  return crypto.createHash("md5").update(prompt.toLowerCase().trim()).digest("hex");
}

/**
 * Get cached image for a prompt
 * @param {string} prompt - The image generation prompt
 * @returns {object|null} - Cached image data or null if not found
 */
export function getCachedVibeImage(prompt) {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_CACHE_FILE, "utf8"));
    const key = generateCacheKey(prompt);

    if (cache[key]) {
      console.log(`📦 Using cached image for prompt: "${prompt.substring(0, 50)}..."`);
      return cache[key];
    }

    return null;
  } catch (error) {
    console.error("Error reading vibe image cache:", error.message);
    return null;
  }
}

/**
 * Save image to cache
 * @param {string} prompt - The image generation prompt
 * @param {object} imageData - The image data to cache
 */
export function cacheVibeImage(prompt, imageData) {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_CACHE_FILE, "utf8"));
    const key = generateCacheKey(prompt);

    cache[key] = {
      imageUrl: imageData.imageUrl,
      prompt: imageData.prompt,
      timestamp: new Date().toISOString(),
      originalPrompt: prompt,
    };

    fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
    console.log(`💾 Cached image for prompt: "${prompt.substring(0, 50)}..."`);
  } catch (error) {
    console.error("Error writing vibe image cache:", error.message);
  }
}

/**
 * Clear the entire vibe image cache
 */
export function clearVibeImageCache() {
  fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify({}), "utf8");
  console.log("🗑️  Vibe image cache cleared");
}

/**
 * Get cache statistics
 */
export function getVibeImageCacheStats() {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_CACHE_FILE, "utf8"));
    const entries = Object.keys(cache);

    return {
      totalImages: entries.length,
      images: entries.map((key) => ({
        key,
        prompt: cache[key].originalPrompt,
        timestamp: cache[key].timestamp,
      })),
    };
  } catch (error) {
    return { totalImages: 0, images: [] };
  }
}
