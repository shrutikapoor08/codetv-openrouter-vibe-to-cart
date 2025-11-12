/**
 * Mock vibe-based product recommendations for testing
 * Each vibe maps to an array of product objects with emoji, name, and reason
 */
export const MOCK_VIBES = {
  "villain era": [
    {
      emoji: "🕶️",
      name: "Sunglasses So Dark Your Emotions Can't Escape",
      reason: "Because eye contact is for people who aren't plotting.",
      image: "/images/villain-sunglasses.svg",
    },
    {
      emoji: "🖤",
      name: "Black Hoodie (Oversized)",
      reason: "For emotional support and mysterious exits.",
      image: "/images/villain-hoodie.svg",
    },
    {
      emoji: "💅",
      name: "Therapy Journal (Never Opened)",
      reason: "Journaling is self-care. Not opening it is self-preservation.",
      image: "/images/villain-journal.svg",
    },
  ],
  "hot girl autumn but broke": [
    {
      emoji: "🍂",
      name: "Pumpkin Spice Candle from Target",
      reason: "The aesthetic costs $7.99. Your credit card thanks you.",
      image: "/images/autumn-candle.svg",
    },
    {
      emoji: "🧣",
      name: "Thrifted Oversized Sweater",
      reason: "Vintage = expensive. Secondhand = financially responsible icon.",
      image: "/images/autumn-sweater.svg",
    },
    {
      emoji: "☕",
      name: "Home Coffee Maker",
      reason: "$5 lattes are cute until rent is due.",
      image: "/images/autumn-coffee.svg",
    },
  ],
  "cottagecore ceo": [
    {
      emoji: "🌿",
      name: "Linen Blazer in Sage Green",
      reason: "Business meetings, but make it ethereal forest nymph.",
      image: "/images/cottagecore-blazer.svg",
    },
    {
      emoji: "📚",
      name: "Leather-Bound Planner",
      reason: "Schedule your empire between foraging and mindfulness.",
      image: "/images/cottagecore-planner.svg",
    },
    {
      emoji: "🕯️",
      name: "Beeswax Candles (Artisanal)",
      reason: "Boardroom lighting should smell like a meadow.",
      image: "/images/cottagecore-candles.svg",
    },
  ],
  "chaotic good but make it fashion": [
    {
      emoji: "✨",
      name: "Sequined Jacket (Mismatched)",
      reason: "Saving the world requires sparkle and zero coordination.",
      image: "/images/chaotic-jacket.svg",
    },
    {
      emoji: "🎨",
      name: "Paint-Splattered Combat Boots",
      reason: "For kicking ass and attending art openings.",
      image: "/images/chaotic-boots.svg",
    },
    {
      emoji: "🌈",
      name: "Rainbow Fanny Pack",
      reason: "Practical chaos storage for your chaotic good adventures.",
      image: "/images/chaotic-fanny.svg",
    },
  ],
  "divorced but thriving": [
    {
      emoji: "💃",
      name: "Red Dress (Revenge Edition)",
      reason: "You didn't lose a spouse, you gained a wardrobe upgrade.",
      image: "/images/divorced-dress.svg",
    },
    {
      emoji: "🥂",
      name: "Champagne Flutes (Set of One)",
      reason: "Cheers to never sharing your prosecco again.",
      image: "/images/divorced-champagne.svg",
    },
    {
      emoji: "📱",
      name: "Dating App Premium Subscription",
      reason: "Their loss is someone else's gain.",
      image: "/images/divorced-dating.svg",
    },
  ],
  "post-apocalyptic brunch influencer": [
    {
      emoji: "🥑",
      name: "Avocado Toast in a Bunker",
      reason: "The world may be ending, but your aesthetic isn't.",
      image: "/images/apocalypse-avocado.svg",
    },
    {
      emoji: "⚔️",
      name: "Designer Machete",
      reason: "For cutting through zombies and bad vibes.",
      image: "/images/apocalypse-machete.svg",
    },
    {
      emoji: "📸",
      name: "Solar-Powered Ring Light",
      reason: "Document the apocalypse in golden hour lighting.",
      image: "/images/apocalypse-ring-light.svg",
    },
  ],
  "startup founder in denial": [
    {
      emoji: "💡",
      name: "Lightbulb Moment Sticky Notes",
      reason: "All your pivots in one place.",
      image: "/images/startup-sticky-notes.svg",
    },
    {
      emoji: "☕",
      name: "Espresso Machine (Industrial)",
      reason: "Sleep is for companies with Series B funding.",
      image: "/images/startup-espresso.svg",
    },
    {
      emoji: "🎢",
      name: "Emotional Rollercoaster Season Pass",
      reason: "It's not failure, it's learning. (It's failure.)",
      image: "/images/startup-rollercoaster.svg",
    },
  ],
  "cyberpunk beach bum": [
    {
      emoji: "🌊",
      name: "Neon Surfboard",
      reason: "Catch waves and hack the mainframe.",
      image: "/images/cyberpunk-surfboard.svg",
    },
    {
      emoji: "🕶️",
      name: "AR Sunglasses",
      reason: "See the ocean AND your cryptocurrency crash in real-time.",
      image: "/images/cyberpunk-ar-glasses.svg",
    },
    {
      emoji: "🏝️",
      name: "Solar-Powered Hammock",
      reason: "Off-grid beach naps with WiFi somehow.",
      image: "/images/cyberpunk-hammock.svg",
    },
  ],
};

/**
 * Default products when vibe is not recognized
 */
export const DEFAULT_VIBE = [
  {
    emoji: "🎲",
    name: "Mystery Box of Chaos",
    reason: "We don't understand your vibe, so here's a random product.",
    image: "/images/default-mystery.svg",
  },
  {
    emoji: "🤷",
    name: "Existential Crisis Starter Kit",
    reason: "When your vibe is too deep for our AI to comprehend.",
    image: "/images/default-crisis.svg",
  },
  {
    emoji: "🔮",
    name: "Crystal Ball (Unclear Future)",
    reason: "Even AI can't predict where your vibe is going.",
    image: "/images/default-crystal.svg",
  },
];

/**
 * Roast responses for specific vibes (used in roast mode)
 */
export const ROAST_RESPONSES = {
  "villain era":
    "A villain era? Honey, villains have plans. You're giving 'forgot to return a library book' energy.",
  "hot girl autumn but broke":
    "Hot girl autumn but broke is just regular autumn with better lighting in your selfies.",
  "cottagecore ceo":
    "You want to run a Fortune 500 company from a fairy cottage? LinkedIn is not a fairy tale, Susan.",
  default:
    "Your vibe is giving 'I watched one TikTok and made it my personality.' Iconic, but make it less predictable.",
};
