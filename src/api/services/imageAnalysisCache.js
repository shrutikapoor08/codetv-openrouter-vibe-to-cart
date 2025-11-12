import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PATHS } from "../utils/paths.js";

// Path to cache directory
const CACHE_DIR = PATHS.CACHE_DIR;
const IMAGE_ANALYSIS_CACHE_FILE = path.join(CACHE_DIR, "image-analysis.json");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Initialize cache file if it doesn't exist
if (!fs.existsSync(IMAGE_ANALYSIS_CACHE_FILE)) {
  fs.writeFileSync(IMAGE_ANALYSIS_CACHE_FILE, JSON.stringify({}), "utf8");
}

/**
 * Generate a cache key for an image URL
 * Uses MD5 hash for shorter keys
 * @param {string} imageUrl - The image URL to analyze
 * @returns {string} - Cache key
 */
function generateImageKey(imageUrl) {
  // Use MD5 hash of the URL for consistent, shorter keys
  return crypto.createHash("md5").update(imageUrl).digest("hex");
}

/**
 * Get cached analysis for an image
 * @param {string} imageUrl - The image URL
 * @returns {Object|null} - Cached analysis or null if not found
 */
export function getCachedImageAnalysis(imageUrl) {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_ANALYSIS_CACHE_FILE, "utf8"));
    const key = generateImageKey(imageUrl);

    if (cache[key]) {
      console.log(`📦 Using cached analysis for image: ${imageUrl.substring(0, 60)}...`);
      return cache[key].analysis;
    }

    return null;
  } catch (error) {
    console.error("Error reading image analysis cache:", error.message);
    return null;
  }
}

/**
 * Save image analysis to cache
 * @param {string} imageUrl - The image URL
 * @param {Object} analysis - The analysis result to cache
 */
export function cacheImageAnalysis(imageUrl, analysis) {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_ANALYSIS_CACHE_FILE, "utf8"));
    const key = generateImageKey(imageUrl);

    cache[key] = {
      analysis,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl.substring(0, 100), // Store truncated URL for reference
      itemCount: analysis.items?.length || 0,
    };

    fs.writeFileSync(IMAGE_ANALYSIS_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
    console.log(`💾 Cached image analysis: ${analysis.items?.length || 0} items found`);
  } catch (error) {
    console.error("Error writing image analysis cache:", error.message);
  }
}

/**
 * Clear the entire image analysis cache
 */
export function clearImageAnalysisCache() {
  fs.writeFileSync(IMAGE_ANALYSIS_CACHE_FILE, JSON.stringify({}), "utf8");
  console.log("🗑️  Image analysis cache cleared");
}

/**
 * Get cache statistics
 */
export function getImageAnalysisCacheStats() {
  try {
    const cache = JSON.parse(fs.readFileSync(IMAGE_ANALYSIS_CACHE_FILE, "utf8"));
    const entries = Object.keys(cache);

    return {
      totalAnalyses: entries.length,
      analyses: entries.map((key) => ({
        key,
        imageUrl: cache[key].imageUrl,
        itemCount: cache[key].itemCount,
        timestamp: cache[key].timestamp,
      })),
    };
  } catch (error) {
    return { totalAnalyses: 0, analyses: [] };
  }
}
