/**
 * Loading messages shown while AI processes the user's vibe
 */
export const LOADING_MESSAGES = [
  "Consulting your inner chaos...",
  "Reading your aura...",
  "Channeling your main character energy...",
  "Vibing with the universe...",
  "Analyzing your aesthetic...",
  "Summoning your spirit products...",
];

/**
 * Pre-defined vibes for the "Surprise Me" button
 */
export const SURPRISE_VIBES = [
  "villain era",
  "hot girl autumn but broke",
  "cottagecore ceo",
  "chaotic good but make it fashion",
  "divorced but thriving",
  "post-apocalyptic brunch influencer",
  "startup founder in denial",
  "cyberpunk beach bum",
  "main character energy with student loan debt",
  "hot mess express",
  "sad indie music protagonist",
  "feral academic",
  "girlboss gaslight gatekeep",
  "dark academia dropout",
  "cottage witch on antidepressants",
];

/**
 * Easter egg messages triggered by specific keywords in user input
 */
export const EASTER_EGG_TRIGGERS = [
  {
    keywords: ["villain", "evil"],
    message: "🦹‍♀️ We sense dark energy... excellent.",
  },
  {
    keywords: ["chaotic", "chaos"],
    message: "🌪️ Chaos detected. Recommend glitter and bad decisions.",
  },
  {
    keywords: ["ceo", "boss"],
    message: "💼 Boss energy detected. Don't forget to hydrate between meetings.",
  },
  {
    keywords: ["broke", "poor"],
    message: "💸 We see you. Window shopping is still shopping.",
  },
  {
    keywords: ["therapy", "therapist"],
    message: "🛋️ This app is NOT a licensed therapist. But we can recommend candles.",
  },
  {
    keywords: ["sad", "depressed"],
    message: "🥺 Sending virtual hugs... and product recommendations.",
  },
];

/**
 * Check if user's vibe triggers an easter egg
 * @param {string} vibe - User's vibe input
 * @returns {string} Easter egg message or empty string
 */
export function getEasterEggMessage(vibe: string): string {
  const lowerVibe = vibe.toLowerCase();
  
  for (const trigger of EASTER_EGG_TRIGGERS) {
    if (trigger.keywords.some(keyword => lowerVibe.includes(keyword))) {
      return trigger.message;
    }
  }
  
  return "";
}
