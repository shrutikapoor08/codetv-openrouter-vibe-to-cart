import "dotenv/config";
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Hackathon mode - allow self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Product image prompts for generation
const PRODUCTS = [
  // Villain Era
  { id: "villain-sunglasses", prompt: "ultra-dark designer sunglasses, product photography, 4k" },
  { id: "villain-hoodie", prompt: "oversized black hoodie, streetwear, product shot" },
  { id: "villain-journal", prompt: "elegant closed leather journal, minimalist, unopened" },
  
  // Hot Girl Autumn But Broke  
  { id: "autumn-candle", prompt: "pumpkin spice candle in jar, autumn aesthetic, warm glow" },
  { id: "autumn-sweater", prompt: "cozy oversized knit sweater, autumn colors, thrifted vintage" },
  { id: "autumn-coffee", prompt: "modern home coffee maker, brewing coffee, kitchen aesthetic" },
  
  // Cottagecore CEO
  { id: "cottagecore-blazer", prompt: "linen blazer sage green, natural fabric, business cottagecore" },
  { id: "cottagecore-planner", prompt: "leather-bound planner open, executive style, warm lighting" },
  { id: "cottagecore-candles", prompt: "artisanal beeswax candles, natural honey color, rustic" },
  
  // Chaotic Good
  { id: "chaotic-jacket", prompt: "sequined jacket mismatched colors, glittery, bold fashion" },
  { id: "chaotic-boots", prompt: "combat boots with paint splatters, artistic edgy style" },
  { id: "chaotic-fanny", prompt: "rainbow fanny pack, vibrant colors, 90s festival fashion" },
  
  // Divorced But Thriving
  { id: "divorced-dress", prompt: "stunning red cocktail dress, elegant revenge dress" },
  { id: "divorced-champagne", prompt: "single champagne flute filled, celebration, luxurious" },
  { id: "divorced-dating", prompt: "smartphone with dating app interface, modern UI, romantic" },
  
  // Post-Apocalyptic Brunch
  { id: "apocalypse-avocado", prompt: "gourmet avocado toast, bunker setting, Instagram food photo" },
  { id: "apocalypse-machete", prompt: "designer machete luxury aesthetic, tactical fashion" },
  { id: "apocalypse-ring-light", prompt: "ring light with solar panels, photography equipment" },
  
  // Startup Founder
  { id: "startup-sticky-notes", prompt: "colorful sticky notes with lightbulbs, creative office" },
  { id: "startup-espresso", prompt: "industrial espresso machine, professional, chrome steel" },
  { id: "startup-rollercoaster", prompt: "vintage emotional rollercoaster ticket, metaphorical" },
  
  // Cyberpunk Beach Bum
  { id: "cyberpunk-surfboard", prompt: "neon LED surfboard, cyberpunk futuristic, glowing" },
  { id: "cyberpunk-ar-glasses", prompt: "AR sunglasses holographic display, cyberpunk tech" },
  { id: "cyberpunk-hammock", prompt: "hammock with solar panels, futuristic tropical tech" },
  
  // Default
  { id: "default-mystery", prompt: "mysterious glowing box with question marks, magical" },
  { id: "default-crisis", prompt: "existential crisis starter kit box, philosophical humor" },
  { id: "default-crystal", prompt: "crystal ball cloudy unclear, fortune telling, mysterious" },
];

async function generateImageWithFlux(product) {
  console.log(`\n🎨 Generating: ${product.id}`);
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "black-forest-labs/flux-pro",
      prompt: product.prompt,
      width: 512,
      height: 512,
      steps: 20,
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'HTTP-Referer': 'https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart',
        'X-Title': 'Vibe to Cart'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      console.log(`   Status: ${res.statusCode}`);

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`   Response length: ${responseData.length}`);
        if (!responseData) {
          reject(new Error(`Empty response with status ${res.statusCode}`));
          return;
        }
        try {
          const parsed = JSON.parse(responseData);
          console.log(`   ✅ Generated`);
          resolve({ success: true, data: parsed, id: product.id });
        } catch (e) {
          console.log(`   Raw response:`, responseData);
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   ❌ Error:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("🚀 Testing image generation API...\n");
  
  // Test with just one product first
  try {
    const result = await generateImageWithFlux(PRODUCTS[0]);
    console.log("\n📊 Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  }
}

main().catch(console.error);
