import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to public/images directory
const IMAGES_DIR = path.join(__dirname, "../../public/images");

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Generate a unique filename for a product based on its name and description
 * @param {string} productName - The product name
 * @param {string} productReason - The product description/reason
 * @returns {string} - The filename (without extension)
 */
export function generateProductImageFilename(productName, productReason) {
  // Create a hash from product name + reason to ensure uniqueness
  const hash = crypto
    .createHash("md5")
    .update(`${productName}-${productReason}`)
    .digest("hex")
    .substring(0, 12);
  
  // Sanitize product name for filename
  const sanitized = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);
  
  return `${sanitized}-${hash}`;
}

/**
 * Check if a cached image exists for a product
 * @param {string} productName - The product name
 * @param {string} productReason - The product description/reason
 * @returns {string|null} - The relative image path if exists, null otherwise
 */
export function getCachedImagePath(productName, productReason) {
  const filename = generateProductImageFilename(productName, productReason);
  const imagePath = path.join(IMAGES_DIR, `${filename}.png`);
  
  console.log(`  🔍 Looking for: ${filename}.png`);
  console.log(`     Full path: ${imagePath}`);
  console.log(`     Exists: ${fs.existsSync(imagePath)}`);
  
  if (fs.existsSync(imagePath)) {
    console.log(`  ✅ Found exact match!`);
    return `/images/${filename}.png`;
  }
  
  // If exact match not found, try to find by product name prefix
  const sanitizedName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);
  
  console.log(`     Trying fallback with prefix: ${sanitizedName}`);
  
  const files = fs.readdirSync(IMAGES_DIR);
  const matchingFile = files.find(f => 
    f.startsWith(sanitizedName) && f.endsWith('.png')
  );
  
  if (matchingFile) {
    console.log(`  ✅ Found fallback match: ${matchingFile}`);
    return `/images/${matchingFile}`;
  }
  
  console.log(`  ❌ No cached image found for: ${productName}`);
  return null;
}

/**
 * Save base64 image data to disk
 * @param {string} productName - The product name
 * @param {string} productReason - The product description/reason
 * @param {string} base64Data - The base64 image data (with or without data URI prefix)
 * @returns {string} - The relative image path
 */
export function saveProductImage(productName, productReason, base64Data) {
  try {
    const filename = generateProductImageFilename(productName, productReason);
    const imagePath = path.join(IMAGES_DIR, `${filename}.png`);
    
    // Remove data URI prefix if present
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
    
    // Validate base64 data
    if (!base64Content || base64Content.length < 100) {
      throw new Error(`Invalid base64 data for ${productName}: length=${base64Content?.length || 0}`);
    }
    
    // Save to disk
    fs.writeFileSync(imagePath, base64Content, "base64");
    
    console.log(`💾 Saved product image: ${filename}.png (${(base64Content.length / 1024).toFixed(1)} KB)`);
    
    return `/images/${filename}.png`;
  } catch (error) {
    console.error(`❌ Failed to save image for ${productName}:`, error.message);
    throw error;
  }
}

/**
 * Get cache statistics
 * @returns {object} - Cache stats
 */
export function getCacheStats() {
  const files = fs.readdirSync(IMAGES_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  
  return {
    totalImages: pngFiles.length,
    cacheDir: IMAGES_DIR,
  };
}
