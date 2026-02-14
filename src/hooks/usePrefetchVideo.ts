import { useEffect, useRef, useCallback } from "react";
import { createVideoPlayer, type VideoPlayer } from "expo-video";
import { createVideoSource } from "@/services/videoCacheService";

// Start prefetching when current video reaches this progress (20%)
const PREFETCH_TRIGGER_PROGRESS = 0.2;

type UsePrefetchVideoOptions = {
  /** The URI of the next video to prefetch */
  nextVideoUri: string | null;
  /** Current playback progress (0 to 1) */
  currentProgress: number;
  /** Whether prefetching is enabled */
  enabled?: boolean;
};

type UsePrefetchVideoResult = {
  /** Whether the next video is currently being prefetched */
  isPrefetching: boolean;
  /** Manually trigger prefetch for a specific URI */
  prefetchVideo: (uri: string) => void;
  /** Get the prefetched player if available (for seamless transition) */
  getPrefetchedPlayer: () => VideoPlayer | null;
  /** Clean up the prefetched player */
  clearPrefetch: () => void;
};

/**
 * Hook to prefetch the next video in a playlist while the current video is playing.
 * Creates a background VideoPlayer that buffers the next video for seamless playback.
 */
export const usePrefetchVideo = ({
  nextVideoUri,
  currentProgress,
  enabled = true,
}: UsePrefetchVideoOptions): UsePrefetchVideoResult => {
  const prefetchPlayerRef = useRef<VideoPlayer | null>(null);
  const prefetchedUriRef = useRef<string | null>(null);
  const isPrefetchingRef = useRef(false);

  const clearPrefetch = useCallback(() => {
    if (prefetchPlayerRef.current) {
      try {
        prefetchPlayerRef.current.release();
      } catch (error) {
        console.warn("[Prefetch] Failed to release player:", error);
      }
      prefetchPlayerRef.current = null;
      prefetchedUriRef.current = null;
      isPrefetchingRef.current = false;
    }
  }, []);

  const prefetchVideo = useCallback(
    (uri: string) => {
      // Skip if already prefetching this URI
      if (prefetchedUriRef.current === uri) {
        return;
      }

      // Clean up any existing prefetch player
      clearPrefetch();

      try {
        isPrefetchingRef.current = true;
        prefetchedUriRef.current = uri;

        // Create a background player for prefetching (buffers into memory)
        const videoSource = createVideoSource(uri);
        const player = createVideoPlayer(videoSource);

        // Keep it paused - we only want to buffer, not play
        player.pause();

        prefetchPlayerRef.current = player;

        console.log("[Prefetch] Started prefetching:", uri);
      } catch (error) {
        console.warn("[Prefetch] Failed to create prefetch player:", error);
        isPrefetchingRef.current = false;
        prefetchedUriRef.current = null;
      }
    },
    [clearPrefetch]
  );

  const getPrefetchedPlayer = useCallback(() => {
    return prefetchPlayerRef.current;
  }, []);

  // Auto-trigger prefetch based on progress
  useEffect(() => {
    if (!enabled || !nextVideoUri) {
      return;
    }

    // Start prefetching when progress reaches threshold
    if (
      currentProgress >= PREFETCH_TRIGGER_PROGRESS &&
      prefetchedUriRef.current !== nextVideoUri
    ) {
      prefetchVideo(nextVideoUri);
    }
  }, [enabled, nextVideoUri, currentProgress, prefetchVideo]);

  // Cleanup on unmount or when nextVideoUri changes to a different video
  useEffect(() => {
    return () => {
      clearPrefetch();
    };
  }, [clearPrefetch]);

  // Clear prefetch if the next video URI changes (user skipped ahead)
  useEffect(() => {
    if (
      prefetchedUriRef.current &&
      nextVideoUri &&
      prefetchedUriRef.current !== nextVideoUri
    ) {
      clearPrefetch();
    }
  }, [nextVideoUri, clearPrefetch]);

  return {
    isPrefetching: isPrefetchingRef.current,
    prefetchVideo,
    getPrefetchedPlayer,
    clearPrefetch,
  };
};
