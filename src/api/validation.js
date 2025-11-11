// API Key validation utilities

/**
 * Validates that all required API keys are present in environment variables
 * Exits the process with error code 1 if any keys are missing
 */
export function validateAPIKeys() {
  const requiredKeys = ["OPENAI_API_KEY", "TAVILY_API_KEY"];
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
      "\nPlease add these to your .env.local file and restart the server.\n"
    );
    process.exit(1);
  }

  console.log("✅ All required API keys are present");
}
