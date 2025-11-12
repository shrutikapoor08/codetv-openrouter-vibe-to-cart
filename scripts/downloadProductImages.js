/**
 * Since OpenRouter doesn't currently support dedicated image generation endpoints,
 * we'll use placeholder images and map them to our products.
 * 
 * For a hackathon/demo, we can either:
 * 1. Use emoji as visual representations (current approach)
 * 2. Use free stock images from Unsplash/Pexels  
 * 3. Use AI-generated placeholders
 * 4. Create simple SVG icons
 * 
 * For now, let's use curated free images and create a simple mapping.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');

// Curated unsplash images for each product
const IMAGE_URLS = {
  // Villain Era
  "villain-sunglasses": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
  "villain-hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
  "villain-journal": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
  
  // Hot Girl Autumn
  "autumn-candle": "https://images.unsplash.com/photo-1602874801007-0ee004ed14cf?w=400&h=400&fit=crop",
  "autumn-sweater": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
  "autumn-coffee": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
  
  // Cottagecore CEO
  "cottagecore-blazer": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
  "cottagecore-planner": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop",
  "cottagecore-candles": "https://images.unsplash.com/photo-1602874801007-0ee004ed14cf?w=400&h=400&fit=crop",
  
  // Chaotic Good
  "chaotic-jacket": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
  "chaotic-boots": "https://images.unsplash.com/photo-1542834369-a5c5ea13d3b3?w=400&h=400&fit=crop",
  "chaotic-fanny": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  
  // Divorced But Thriving
  "divorced-dress": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
  "divorced-champagne": "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=400&fit=crop",
  "divorced-dating": "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=400&fit=crop",
  
  // Post-Apocalyptic Brunch
  "apocalypse-avocado": "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&h=400&fit=crop",
  "apocalypse-machete": "https://images.unsplash.com/photo-1596490929699-d66560a2e007?w=400&h=400&fit=crop",
  "apocalypse-ring-light": "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400&h=400&fit=crop",
  
  // Startup Founder
  "startup-sticky-notes": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
  "startup-espresso": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
  "startup-rollercoaster": "https://images.unsplash.com/photo-1509716436151-f0bc0e1c42a1?w=400&h=400&fit=crop",
  
  // Cyberpunk Beach Bum
  "cyberpunk-surfboard": "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=400&fit=crop",
  "cyberpunk-ar-glasses": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
  "cyberpunk-hammock": "https://images.unsplash.com/photo-1563743879322-f2f44b9d40ca?w=400&h=400&fit=crop",
  
  // Default
  "default-mystery": "https://images.unsplash.com/photo-1549298222-1c3271fb86f1?w=400&h=400&fit=crop",
  "default-crisis": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
  "default-crystal": "https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=400&h=400&fit=crop",
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`  📥 Downloading ${filename}...`);
    
    const filepath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Saved ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log("🖼️  Downloading product images from Unsplash...\n");
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  const entries = Object.entries(IMAGE_URLS);
  console.log(`📦 Total images to download: ${entries.length}\n`);
  
  for (const [id, url] of entries) {
    const filename = `${id}.jpg`;
    try {
      await downloadImage(url, filename);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Failed to download ${id}:`, error.message);
    }
  }
  
  console.log("\n✨ Image download complete!");
  console.log(`📁 Images saved to: ${imagesDir}`);
}

main().catch(console.error);
