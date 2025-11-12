/**
 * Generate simple SVG placeholder images for products
 * This avoids network issues and provides instant visual feedback
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');

// Product configurations with colors and icons
const PRODUCTS = {
  // Villain Era - Dark theme
  "villain-sunglasses": { color: "#1a1a1a", emoji: "🕶️", gradient: ["#2d3748", "#1a202c"] },
  "villain-hoodie": { color: "#2d3748", emoji: "🖤", gradient: ["#2d3748", "#000000"] },
  "villain-journal": { color: "#4a5568", emoji: "💅", gradient: ["#4a5568", "#2d3748"] },
  
  // Hot Girl Autumn - Warm autumn colors
  "autumn-candle": { color: "#ed8936", emoji: "🍂", gradient: ["#ed8936", "#dd6b20"] },
  "autumn-sweater": { color: "#d69e2e", emoji: "🧣", gradient: ["#d69e2e", "#b7791f"] },
  "autumn-coffee": { color: "#975a16", emoji: "☕", gradient: ["#975a16", "#744210"] },
  
  // Cottagecore CEO - Earth tones
  "cottagecore-blazer": { color: "#68d391", emoji: "🌿", gradient: ["#68d391", "#48bb78"] },
  "cottagecore-planner": { color: "#9c4221", emoji: "📚", gradient: ["#9c4221", "#7c2d12"] },
  "cottagecore-candles": { color: "#ecc94b", emoji: "🕯️", gradient: ["#ecc94b", "#d69e2e"] },
  
  // Chaotic Good - Bright, vibrant
  "chaotic-jacket": { color: "#f687b3", emoji: "✨", gradient: ["#f687b3", "#d53f8c"] },
  "chaotic-boots": { color: "#fc8181", emoji: "🎨", gradient: ["#fc8181", "#f56565"] },
  "chaotic-fanny": { color: "#9f7aea", emoji: "🌈", gradient: ["#9f7aea", "#805ad5"] },
  
  // Divorced But Thriving - Bold reds
  "divorced-dress": { color: "#f56565", emoji: "💃", gradient: ["#f56565", "#c53030"] },
  "divorced-champagne": { color: "#fbd38d", emoji: "🥂", gradient: ["#fbd38d", "#f6ad55"] },
  "divorced-dating": { color: "#fc8181", emoji: "📱", gradient: ["#fc8181", "#f56565"] },
  
  // Post-Apocalyptic - Muted, grungy
  "apocalypse-avocado": { color: "#68d391", emoji: "🥑", gradient: ["#68d391", "#48bb78"] },
  "apocalypse-machete": { color: "#718096", emoji: "⚔️", gradient: ["#718096", "#4a5568"] },
  "apocalypse-ring-light": { color: "#fbd38d", emoji: "📸", gradient: ["#fbd38d", "#f6ad55"] },
  
  // Startup - Tech blues and grays
  "startup-sticky-notes": { color: "#faf089", emoji: "💡", gradient: ["#faf089", "#f6e05e"] },
  "startup-espresso": { color: "#4a5568", emoji: "☕", gradient: ["#4a5568", "#2d3748"] },
  "startup-rollercoaster": { color: "#fc8181", emoji: "🎢", gradient: ["#fc8181", "#f56565"] },
  
  // Cyberpunk - Neon colors
  "cyberpunk-surfboard": { color: "#667eea", emoji: "🌊", gradient: ["#667eea", "#764ba2"] },
  "cyberpunk-ar-glasses": { color: "#4fd1c5", emoji: "🕶️", gradient: ["#4fd1c5", "#38b2ac"] },
  "cyberpunk-hammock": { color: "#9f7aea", emoji: "🏝️", gradient: ["#9f7aea", "#805ad5"] },
  
  // Default - Mysterious
  "default-mystery": { color: "#805ad5", emoji: "🎲", gradient: ["#805ad5", "#6b46c1"] },
  "default-crisis": { color: "#4a5568", emoji: "🤷", gradient: ["#4a5568", "#2d3748"] },
  "default-crystal": { color: "#9f7aea", emoji: "🔮", gradient: ["#9f7aea", "#805ad5"] },
};

function generateSVG(id, config) {
  const { emoji, gradient } = config;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="400" fill="url(#grad${id})"/>
  
  <!-- Emoji circle background -->
  <circle cx="200" cy="200" r="120" fill="rgba(255,255,255,0.15)" filter="url(#shadow)"/>
  
  <!-- Emoji -->
  <text x="200" y="240" font-size="140" text-anchor="middle" fill="white" opacity="0.9">${emoji}</text>
  
  <!-- Decorative elements -->
  <circle cx="80" cy="80" r="30" fill="rgba(255,255,255,0.1)"/>
  <circle cx="320" cy="320" r="40" fill="rgba(255,255,255,0.1)"/>
  <circle cx="350" cy="100" r="20" fill="rgba(255,255,255,0.08)"/>
</svg>`;
}

function main() {
  console.log("🎨 Generating product placeholder images...\n");
  
  // Create images directory
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log(`📁 Created directory: ${imagesDir}\n`);
  }
  
  const entries = Object.entries(PRODUCTS);
  console.log(`🖼️  Generating ${entries.length} images...\n`);
  
  for (const [id, config] of entries) {
    const svg = generateSVG(id, config);
    const filename = `${id}.svg`;
    const filepath = path.join(imagesDir, filename);
    
    fs.writeFileSync(filepath, svg);
    console.log(`  ✅ Generated ${filename}`);
  }
  
  console.log(`\n✨ Complete! ${entries.length} SVG images created`);
  console.log(`📁 Location: ${imagesDir}`);
}

main();
