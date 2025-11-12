import { getCacheStats } from "../services/imageService.js";
import {
  clearVibeCache,
  getVibeCacheStats,
} from "../services/vibeService.js";

/**
 * GET /api/image-cache-stats
 * Returns statistics about the image cache
 */
export const getImageCacheStats = (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
};

/**
 * GET /api/vibe-cache-stats
 * Returns statistics about the vibe cache
 */
export const getVibeCacheStatsRoute = (req, res) => {
  const stats = getVibeCacheStats();
  res.json(stats);
};

/**
 * POST /api/clear-vibe-cache
 * Clears the vibe cache
 */
export const clearVibeCacheRoute = (req, res) => {
  clearVibeCache();
  res.json({ success: true, message: "Vibe cache cleared" });
};
