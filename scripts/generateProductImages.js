import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Use Flux Pro for image generation (best quality on OpenRouter)
const IMAGE_MODEL = "black-forest-labs/flux-pro";

// All products from mockData.js
const PRODUCTS = [
  // Villain Era
  { id: "villain-sunglasses", name: "Sunglasses So Dark Your Emotions Can't Escape", prompt: "ultra-dark designer sunglasses with reflective black lenses, sleek modern design, dramatic lighting, product photography, high contrast, mysterious vibe" },
  { id: "villain-hoodie", name: "Black Hoodie (Oversized)", prompt: "oversized black hoodie, streetwear style, minimalist design, moody lighting, comfortable aesthetic, mysterious and cozy" },
  { id: "villain-journal", name: "Therapy Journal (Never Opened)", prompt: "elegant closed journal with 'Therapy' embossed on cover, leather bound, pristine and unopened, soft lighting, minimalist product shot" },
  
  // Hot Girl Autumn But Broke
  { id: "autumn-candle", name: "Pumpkin Spice Candle from Target", prompt: "pumpkin spice scented candle in glass jar, autumn aesthetic, warm orange glow, cozy vibes, affordable luxury, Target brand style" },
  { id: "autumn-sweater", name: "Thrifted Oversized Sweater", prompt: "cozy oversized knit sweater in warm autumn colors, vintage thrift store find, soft fabric texture, laid flat product shot" },
  { id: "autumn-coffee", name: "Home Coffee Maker", prompt: "stylish home coffee maker machine, modern design, brewing coffee, warm morning light, kitchen aesthetic" },
  
  // Cottagecore CEO
  { id: "cottagecore-blazer", name: "Linen Blazer in Sage Green", prompt: "elegant linen blazer in sage green color, natural fabric texture, business casual, cottagecore aesthetic, soft natural lighting" },
  { id: "cottagecore-planner", name: "Leather-Bound Planner", prompt: "vintage leather-bound planner with ribbon bookmark, open pages showing calendar, executive style, warm desk lighting" },
  { id: "cottagecore-candles", name: "Beeswax Candles (Artisanal)", prompt: "handmade artisanal beeswax candles, natural honey color, rustic aesthetic, soft candlelight, organic and natural" },
  
  // Chaotic Good But Make It Fashion
  { id: "chaotic-jacket", name: "Sequined Jacket (Mismatched)", prompt: "sequined jacket with mismatched colorful sequins, bold fashion statement, glittery and sparkly, edgy style, studio lighting" },
  { id: "chaotic-boots", name: "Paint-Splattered Combat Boots", prompt: "black combat boots with colorful paint splatters, artistic and edgy, street style, creative fashion statement" },
  { id: "chaotic-fanny", name: "Rainbow Fanny Pack", prompt: "vibrant rainbow colored fanny pack, fun and practical, 90s revival style, bright colors, festival fashion" },
  
  // Divorced But Thriving
  { id: "divorced-dress", name: "Red Dress (Revenge Edition)", prompt: "stunning red cocktail dress, elegant and confident, revenge dress style, dramatic lighting, empowerment aesthetic" },
  { id: "divorced-champagne", name: "Champagne Flutes (Set of One)", prompt: "single elegant champagne flute filled with bubbling champagne, celebration mood, luxurious and independent, soft lighting" },
  { id: "divorced-dating", name: "Dating App Premium Subscription", prompt: "modern smartphone showing dating app interface with premium features, sleek UI design, romantic lighting, digital product" },
  
  // Post-Apocalyptic Brunch Influencer
  { id: "apocalypse-avocado", name: "Avocado Toast in a Bunker", prompt: "gourmet avocado toast plated beautifully inside a concrete bunker setting, post-apocalyptic chic, Instagram-worthy food photography" },
  { id: "apocalypse-machete", name: "Designer Machete", prompt: "sleek designer machete with luxury brand aesthetic, tactical meets high fashion, dramatic lighting, product photography" },
  { id: "apocalypse-ring-light", name: "Solar-Powered Ring Light", prompt: "professional ring light with solar panels, photography equipment, sustainable tech, influencer gear, modern design" },
  
  // Startup Founder in Denial
  { id: "startup-sticky-notes", name: "Lightbulb Moment Sticky Notes", prompt: "colorful sticky notes with lightbulb icons, creative brainstorming tools, startup office aesthetic, organized chaos" },
  { id: "startup-espresso", name: "Espresso Machine (Industrial)", prompt: "industrial-grade espresso machine, professional barista equipment, chrome and steel, busy startup office vibe" },
  { id: "startup-rollercoaster", name: "Emotional Rollercoaster Season Pass", prompt: "vintage amusement park ticket for emotional rollercoaster, creative metaphor visualization, nostalgic design, emotional startup journey" },
  
  // Cyberpunk Beach Bum
  { id: "cyberpunk-surfboard", name: "Neon Surfboard", prompt: "surfboard with neon LED lights, cyberpunk aesthetic, futuristic beach gear, glowing blue and pink lights, tech meets surf culture" },
  { id: "cyberpunk-ar-glasses", name: "AR Sunglasses", prompt: "futuristic AR sunglasses with holographic display, cyberpunk tech, sleek design, heads-up display, sci-fi product" },
  { id: "cyberpunk-hammock", name: "Solar-Powered Hammock", prompt: "high-tech hammock with integrated solar panels, futuristic beach relaxation, sustainable tech, tropical cyberpunk" },
  
  // Default Vibe
  { id: "default-mystery", name: "Mystery Box of Chaos", prompt: "mysterious glowing box with question marks, random surprises, chaotic energy, magical product photography" },
  { id: "default-crisis", name: "Existential Crisis Starter Kit", prompt: "humorous starter kit box with existential items, philosophical humor, moody dramatic lighting, deep thoughts aesthetic" },
  { id: "default-crystal", name: "Crystal Ball (Unclear Future)", prompt: "mystical crystal ball with cloudy unclear reflections, fortune telling aesthetic, mysterious and ambiguous, dramatic lighting" },
];

async function generateImage(product) {
  console.log(`\n🎨 Generating image for: ${product.name}`);
  console.log(`   Prompt: ${product.prompt}`);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
        "X-Title": "Vibe to Cart - Product Image Generator"
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content: `Generate a product image: ${product.prompt}. Style: clean product photography, professional, high quality, well-lit.`
          }
        ],
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`   ✅ Response received`);

    // The response format depends on the model - check what's returned
    console.log(`   Response structure:`, JSON.stringify(data, null, 2).slice(0, 500));

    // For now, we'll use a placeholder approach since image generation models vary
    // In practice, you'd extract the image URL or base64 from the response
    
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error(`   ❌ Error generating image:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log("🚀 Starting product image generation...");
  console.log(`   Using model: ${IMAGE_MODEL}`);
  console.log(`   Total products: ${PRODUCTS.length}\n`);

  // Test with just the first product
  console.log("📋 Testing with first product only...");
  const testProduct = PRODUCTS[0];
  const result = await generateImage(testProduct);

  console.log("\n" + "=".repeat(80));
  console.log("Test completed. Check the output above to see the response format.");
  console.log("You may need to adjust the code based on how the model returns images.");
  console.log("=".repeat(80));
}

main().catch(console.error);
