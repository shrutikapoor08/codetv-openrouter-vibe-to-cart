import { MOCK_MODE } from "./env.js";

/**
 * Validates that all required API keys are present in environment variables
 * Skips validation if MOCK_MODE is enabled
 * Exits the process with error code 1 if any keys are missing
 */
export function validateAPIKeys() {
  // Skip validation in mock mode
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Skipping API key validation");
    return;
  }

  const requiredKeys = ["OPENROUTER_API_KEY"];
  const missingKeys = [];

  for (const key of requiredKeys) {
    if (!process.env[key]) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    console.error("\n❌ ERROR: Missing required API keys:");
    missingKeys.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error(
      "\nPlease add these to your .env file and restart the server.\n"
    );
    process.exit(1);
  }

  console.log("✅ All required API keys are present");
}
