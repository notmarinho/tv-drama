import {
  setVideoCacheSizeAsync,
  clearVideoCacheAsync,
  getCurrentVideoCacheSize,
} from "expo-video";
import type { VideoSource } from "expo-video";

// Default cache size: 500MB (suitable for TV apps)
const DEFAULT_CACHE_SIZE_BYTES = 500 * 1024 * 1024;

/**
 * Initializes the video cache with the specified size.
 * Should be called early in the app lifecycle (before any VideoPlayer is created).
 */
export const initializeVideoCache = async (
  sizeBytes: number = DEFAULT_CACHE_SIZE_BYTES
): Promise<void> => {
  try {
    await setVideoCacheSizeAsync(sizeBytes);
    console.log(`[VideoCache] Initialized with size: ${sizeBytes / 1024 / 1024}MB`);
  } catch (error) {
    console.warn("[VideoCache] Failed to initialize cache:", error);
  }
};

/**
 * Clears all cached video data.
 * Note: Can only be called when no VideoPlayer instances exist.
 */
export const clearVideoCache = async (): Promise<void> => {
  try {
    await clearVideoCacheAsync();
    console.log("[VideoCache] Cache cleared successfully");
  } catch (error) {
    console.warn("[VideoCache] Failed to clear cache:", error);
  }
};

/**
 * Returns the current video cache size in bytes.
 */
export const getVideoCacheSize = (): number => {
  try {
    return getCurrentVideoCacheSize();
  } catch (error) {
    console.warn("[VideoCache] Failed to get cache size:", error);
    return 0;
  }
};

/**
 * Returns the current video cache size formatted as a human-readable string.
 */
export const getFormattedCacheSize = (): string => {
  const bytes = getVideoCacheSize();
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * Checks if a video URI is an HLS stream.
 * HLS streams cannot use caching on iOS.
 */
export const isHlsSource = (uri: string): boolean => {
  const lowerUri = uri.toLowerCase();
  return lowerUri.includes(".m3u8") || lowerUri.includes("m3u8");
};

/**
 * Creates a VideoSource object with caching enabled when supported.
 * Note: HLS sources (.m3u8) cannot use caching on iOS.
 * @param uri - The video URI
 * @param metadata - Optional metadata for the video
 * @param forceCaching - Force caching regardless of source type (use with caution)
 */
export const createCachedVideoSource = (
  uri: string,
  metadata?: { title?: string; artist?: string; artwork?: string },
  forceCaching: boolean = false
): VideoSource => {
  // HLS sources cannot use caching on iOS, so we disable it for those
  const canUseCache = forceCaching || !isHlsSource(uri);
  
  return {
    uri,
    useCaching: canUseCache,
    ...(metadata && { metadata }),
  };
};

/**
 * Creates a VideoSource object without caching.
 * Use this for HLS streams or when caching is not desired.
 * @param uri - The video URI
 * @param metadata - Optional metadata for the video
 */
export const createVideoSource = (
  uri: string,
  metadata?: { title?: string; artist?: string; artwork?: string }
): VideoSource => {
  return {
    uri,
    ...(metadata && { metadata }),
  };
};
