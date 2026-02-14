import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, useTVEventHandler } from "react-native";
import { useVideoPlayer, type VideoPlayer, type VideoSource } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { router } from "expo-router";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useFocusStore } from "@/stores/focusStore";
import { FocusedEpisode } from "@/lib/types";
import { usePrefetchVideo } from "@/hooks/usePrefetchVideo";
import { createVideoSource } from "@/services/videoCacheService";

const OVERLAY_AUTO_HIDE_MS = 10_000;
const TIME_UPDATE_INTERVAL_SECONDS = 0.1;
const SAVE_PROGRESS_INTERVAL_MS = 10_000;

type PlayerContextValue = {
  // State
  focusedEpisode: FocusedEpisode | null;
  hasNextInPlaylist: boolean;
  showOverlay: boolean;
  isPlaying: boolean;
  isEnded: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  player: VideoPlayer;
  playButtonRef: React.RefObject<View | null>;
  forwardButtonRef: React.RefObject<View | null>;
  // Actions
  onBackPress: () => void;
  onForwardPress: () => void;
  onPlayPress: () => void;
  onInteraction: () => void;
  showAndResetOverlay: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export type PlayerProviderProps = {
  children: React.ReactNode;
};

export const PlayerProvider = React.memo(
  ({ children }: PlayerProviderProps) => {
    const focusedEpisode = useFocusStore((s) => s.focusedEpisode);
    const setFocusedEpisode = useFocusStore((s) => s.setFocusedEpisode);

    const episode = focusedEpisode?.episode ?? null;
    const show = focusedEpisode?.show ?? null;
    const seasonIndex = focusedEpisode?.seasonIndex ?? 0;

    // Check if there's a next episode in the current season
    const currentEpisodeIndex = useMemo(() => {
      if (!show || !episode) return -1;
      const episodes = show.seasons?.[seasonIndex]?.episodes ?? [];
      return episodes.findIndex((e) => e.id === episode.id);
    }, [show, episode, seasonIndex]);

    const nextEpisode = useMemo(() => {
      if (!show || currentEpisodeIndex < 0) return null;
      return (
        show.seasons?.[seasonIndex]?.episodes?.[currentEpisodeIndex + 1] ?? null
      );
    }, [show, seasonIndex, currentEpisodeIndex]);

    const hasNextInPlaylist = nextEpisode !== null;

    const { saveProgress, removeEntry, getProgressForEpisode } =
      useContinueWatching();

    const savedProgress = episode ? getProgressForEpisode(episode.id) : 0;

    const playbackRef = useRef({
      currentTime: 0,
      duration: 0,
      showId: show?.id ?? "",
      seasonIndex,
      episodeId: episode?.id ?? "",
    });

    // Track whether we've already restored the saved position for this episode
    const hasRestoredRef = useRef<string | null>(null);

    const [showOverlay, setShowOverlay] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const showOverlayRef = useRef(showOverlay);
    const isEndedRef = useRef(isEnded);
    const playButtonRef = useRef<View>(null);
    const forwardButtonRef = useRef<View>(null);

    isEndedRef.current = isEnded;

    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    showOverlayRef.current = showOverlay;

    const resetHideTimer = useCallback(() => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      // Don't auto-hide overlay when video has ended
      if (isEndedRef.current) {
        return;
      }
      hideTimerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, OVERLAY_AUTO_HIDE_MS);
    }, []);

    const showAndResetOverlay = useCallback(() => {
      setShowOverlay(true);
      resetHideTimer();
    }, [resetHideTimer]);

    useTVEventHandler(
      useCallback(
        (event: { eventType?: string }) => {
          const { eventType } = event;

          const overlayVisible = showOverlayRef.current;
          const isBackKey =
            eventType === "menu" ||
            eventType === "back" ||
            eventType === "escape";

          if (isBackKey) {
            if (overlayVisible) {
              if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
              }
              setShowOverlay(false);
            } else {
              router.back();
            }
          } else if (
            eventType &&
            eventType !== "focus" &&
            eventType !== "blur"
          ) {
            if (!overlayVisible) {
              setShowOverlay(true);
              resetHideTimer();
            } else {
              resetHideTimer();
            }
          }
        },
        [resetHideTimer],
      ),
    );

    useEffect(() => {
      return () => {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }
      };
    }, []);

    // Create video source for the current episode with metadata
    const videoSource: VideoSource = useMemo(() => {
      if (!episode?.videoSource) return "";
      return createVideoSource(episode.videoSource, {
        title: episode.title,
        artist: show?.title,
      });
    }, [episode?.videoSource, episode?.title, show?.title]);

    const player = useVideoPlayer(videoSource, (p) => {
      p.timeUpdateEventInterval = TIME_UPDATE_INTERVAL_SECONDS;
      p.play();
    });

    const { isPlaying } = useEvent(player, "playingChange", {
      isPlaying: player.playing,
    });

    // Detect when video ends - show overlay as primary state
    useEventListener(player, "playToEnd", () => {
      setIsEnded(true);
      setShowOverlay(true);
      // Clear any existing hide timer since we want overlay to stay visible
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      // Focus the forward button if there's a next episode, otherwise focus play button
      setTimeout(() => {
        if (hasNextInPlaylist && forwardButtonRef.current) {
          forwardButtonRef.current.requestTVFocus?.();
        } else {
          playButtonRef.current?.requestTVFocus?.();
        }
      }, 100);
    });

    // Reset isEnded when video starts playing again
    useEffect(() => {
      if (isPlaying && isEnded) {
        setIsEnded(false);
      }
    }, [isPlaying, isEnded]);

    const timeUpdateState = useEvent(player, "timeUpdate", {
      currentTime: player.currentTime,
      currentLiveTimestamp: null,
      currentOffsetFromLive: null,
      bufferedPosition: player.bufferedPosition ?? -1,
    });

    const sourceLoadState = useEvent(player, "sourceLoad", {
      duration: player.duration,
      videoSource: null,
      availableVideoTracks: [],
      availableSubtitleTracks: [],
      availableAudioTracks: [],
    });

    const rawDuration = sourceLoadState?.duration ?? 0;

    // Restore saved position once when the source finishes loading
    useEffect(() => {
      if (
        rawDuration > 0 &&
        episode?.id &&
        hasRestoredRef.current !== episode.id &&
        savedProgress > 0
      ) {
        hasRestoredRef.current = episode.id;
        player.currentTime = savedProgress * rawDuration;
      }
    }, [rawDuration, episode?.id, savedProgress, player]);

    const currentTime = timeUpdateState?.currentTime ?? 0;
    const duration = rawDuration;
    const progress =
      duration > 0 && Number.isFinite(duration)
        ? Math.min(1, Math.max(0, currentTime / duration))
        : 0;

    // Prefetch the next episode while current one is playing
    const nextVideoUri = nextEpisode?.videoSource ?? null;
    usePrefetchVideo({
      nextVideoUri,
      currentProgress: progress,
      enabled: isPlaying && hasNextInPlaylist,
    });

    // Keep playback ref in sync (no re-renders)
    playbackRef.current.currentTime = currentTime;
    playbackRef.current.duration = duration;
    playbackRef.current.showId = show?.id ?? "";
    playbackRef.current.seasonIndex = seasonIndex;
    playbackRef.current.episodeId = episode?.id ?? "";

    // Periodic save (every ~10s) + save on unmount
    useEffect(() => {
      const persistProgress = () => {
        const {
          showId,
          seasonIndex,
          episodeId,
          currentTime: ct,
          duration: dur,
        } = playbackRef.current;
        if (!episodeId || dur <= 0) return;

        saveProgress({
          showId,
          seasonIndex,
          episodeId,
          currentTime: ct,
          duration: dur,
          updatedAt: Date.now(),
        });
      };

      const intervalId = setInterval(
        persistProgress,
        SAVE_PROGRESS_INTERVAL_MS,
      );

      return () => {
        clearInterval(intervalId);
        persistProgress(); // save on unmount
      };
    }, [saveProgress]);

    const onBackPress = useCallback(() => {
      router.back();
    }, []);

    const onForwardPress = useCallback(() => {
      if (nextEpisode && show) {
        // Reset ended state since we're starting a new video
        isEndedRef.current = false;
        setIsEnded(false);
        
        setFocusedEpisode({
          show,
          seasonIndex,
          episode: nextEpisode,
        });
        
        // Start the hide timer for the new video
        resetHideTimer();
      }
      playButtonRef.current?.requestTVFocus();
    }, [nextEpisode, show, seasonIndex, setFocusedEpisode, resetHideTimer]);

    const onPlayPress = useCallback(() => {
      if (isEnded) {
        // Reset progress in continue watching
        if (episode?.id) {
          removeEntry(episode.id);
        }
        // Seek to beginning
        player.currentTime = 0;
        // Play
        player.play();
        // Update ref immediately so resetHideTimer works correctly
        isEndedRef.current = false;
        setIsEnded(false);
        // Start the hide timer now that video is playing again
        resetHideTimer();
      } else if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    }, [player, isEnded, episode?.id, removeEntry, resetHideTimer]);

    const onInteraction = useCallback(() => {
      resetHideTimer();
    }, [resetHideTimer]);

    useEffect(() => {
      return () => {
        setFocusedEpisode(null);
      };
    }, [setFocusedEpisode]);

    const value = useMemo<PlayerContextValue>(
      () => ({
        focusedEpisode,
        hasNextInPlaylist,
        showOverlay,
        isPlaying,
        isEnded,
        currentTime,
        duration,
        progress,
        player,
        onBackPress,
        onForwardPress,
        onPlayPress,
        onInteraction,
        showAndResetOverlay,
        playButtonRef,
        forwardButtonRef,
      }),
      [
        focusedEpisode,
        hasNextInPlaylist,
        showOverlay,
        isPlaying,
        isEnded,
        currentTime,
        duration,
        progress,
        player,
        onBackPress,
        onForwardPress,
        onPlayPress,
        onInteraction,
        showAndResetOverlay,
        playButtonRef,
        forwardButtonRef,
      ],
    );

    return (
      <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
    );
  },
);

PlayerProvider.displayName = "PlayerProvider";

export const usePlayerContext = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
