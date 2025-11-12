/**
 * Centralized environment configuration
 * Manages environment variables and development settings
 */

// Mock mode - set MOCK_MODE=true in .env.local to use mock responses without API calls
export const MOCK_MODE = process.env.MOCK_MODE === "true";

// Development mode - allow self-signed certificates (for corporate proxies, etc.)
// WARNING: Only use in development! Never in production!
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// API Keys (validated separately)
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Server configuration
export const PORT = process.env.PORT || 3001;
