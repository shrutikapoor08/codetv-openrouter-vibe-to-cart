import path from "path";
import { fileURLToPath } from "url";

/**
 * Shared path resolution utilities
 * Use these instead of repeating __dirname setup in every file
 */

/**
 * Get the directory name for the current ES module
 * @param {string} importMetaUrl - Pass import.meta.url from your module
 * @returns {string} The directory path
 */
export function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
}

/**
 * Get the file path for the current ES module
 * @param {string} importMetaUrl - Pass import.meta.url from your module
 * @returns {string} The file path
 */
export function getFilename(importMetaUrl) {
  return fileURLToPath(importMetaUrl);
}

/**
 * Common paths used across the application
 */
const __dirname = getDirname(import.meta.url);

export const PATHS = {
  // Cache directory for vibe storage
  CACHE_DIR: path.join(__dirname, "../../../.cache"),

  // Public images directory
  IMAGES_DIR: path.join(__dirname, "../../../public/images"),

  // Root directory
  ROOT_DIR: path.join(__dirname, "../../../"),
};
