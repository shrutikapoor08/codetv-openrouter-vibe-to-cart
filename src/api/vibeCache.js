import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to cache directory
const CACHE_DIR = path.join(__dirname, "../../.cache");
const VIBE_CACHE_FILE = path.join(CACHE_DIR, "vibes.json");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Initialize cache file if it doesn't exist
if (!fs.existsSync(VIBE_CACHE_FILE)) {
  fs.writeFileSync(VIBE_CACHE_FILE, JSON.stringify({}), "utf8");
}

/**
 * Generate a cache key for a vibe
 * @param {string} vibe - The vibe description
 * @param {boolean} roastMode - Whether it's in roast mode
 * @returns {string} - Cache key
 */
function generateVibeKey(vibe, roastMode = false) {
  const normalized = vibe.toLowerCase().trim();
  const mode = roastMode ? "roast" : "normal";
  return `${mode}:${normalized}`;
}

/**
 * Get cached products for a vibe
 * @param {string} vibe - The vibe description
 * @param {boolean} roastMode - Whether it's in roast mode
 * @returns {Array|null} - Cached products or null if not found
 */
export function getCachedVibe(vibe, roastMode = false) {
  try {
    const cache = JSON.parse(fs.readFileSync(VIBE_CACHE_FILE, "utf8"));
    const key = generateVibeKey(vibe, roastMode);
    
    if (cache[key]) {
      console.log(`📦 Using cached products for vibe: "${vibe}" (${roastMode ? 'roast' : 'normal'} mode)`);
      return cache[key].products;
    }
    
    return null;
  } catch (error) {
    console.error("Error reading vibe cache:", error.message);
    return null;
  }
}

/**
 * Save products for a vibe to cache
 * @param {string} vibe - The vibe description
 * @param {boolean} roastMode - Whether it's in roast mode
 * @param {Array} products - The products to cache
 */
export function cacheVibe(vibe, roastMode, products) {
  try {
    const cache = JSON.parse(fs.readFileSync(VIBE_CACHE_FILE, "utf8"));
    const key = generateVibeKey(vibe, roastMode);
    
    cache[key] = {
      products,
      timestamp: new Date().toISOString(),
      vibe,
      roastMode,
    };
    
    fs.writeFileSync(VIBE_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
    console.log(`💾 Cached products for vibe: "${vibe}" (${products.length} products)`);
  } catch (error) {
    console.error("Error writing vibe cache:", error.message);
  }
}

/**
 * Clear the entire vibe cache
 */
export function clearVibeCache() {
  fs.writeFileSync(VIBE_CACHE_FILE, JSON.stringify({}), "utf8");
  console.log("🗑️  Vibe cache cleared");
}

/**
 * Get cache statistics
 */
export function getVibeCacheStats() {
  try {
    const cache = JSON.parse(fs.readFileSync(VIBE_CACHE_FILE, "utf8"));
    const entries = Object.keys(cache);
    
    return {
      totalVibes: entries.length,
      vibes: entries.map(key => ({
        key,
        vibe: cache[key].vibe,
        roastMode: cache[key].roastMode,
        productCount: cache[key].products.length,
        timestamp: cache[key].timestamp,
      })),
    };
  } catch (error) {
    return { totalVibes: 0, vibes: [] };
  }
}
