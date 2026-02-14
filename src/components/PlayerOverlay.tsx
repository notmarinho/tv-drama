import { StyleSheet, TVFocusGuideView, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Spacings from "@/constants/Spacings";
import { scaleSize } from "@/constants/Ui";
import { FocusableIconButton } from "@/components/FocusableIconButton";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useInitialFocus } from "@/hooks/useInitialFocus";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { formatTime } from "@/ utils/date-time";

const ICON_SIZE = scaleSize(20);
const PLAYER_ICON_SIZE = scaleSize(24);
const PROGRESS_BAR_HEIGHT = scaleSize(4);

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const PlayerOverlay = React.memo(() => {
  const {
    focusedEpisode,
    hasNextInPlaylist,
    showOverlay,
    isPlaying,
    isEnded,
    currentTime,
    duration,
    progress,
    onBackPress,
    onForwardPress,
    onPlayPress,
    onInteraction,
    playButtonRef,
    forwardButtonRef,
  } = usePlayerContext();

  const episode = focusedEpisode?.episode;
  const showTitle = focusedEpisode?.show?.title;

  const colors = useTheme();
  const progressBarWidthRef = useRef(0);

  // Focus forward button when video ended and has next episode, otherwise focus play button
  const initialFocusRef = isEnded && hasNextInPlaylist ? forwardButtonRef : playButtonRef;
  
  useInitialFocus({
    ref: initialFocusRef,
    enabled: showOverlay,
    delay: 100,
    deps: [showOverlay, isEnded, hasNextInPlaylist],
  });

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      progressBarWidthRef.current = e.nativeEvent.layout.width;
    },
    [],
  );

  if (!showOverlay) return null;

  return (
    <AnimatedLinearGradient
      entering={FadeIn}
      exiting={FadeOut}
      colors={["transparent", "#000000"]}
      style={[StyleSheet.absoluteFillObject, styles.overlay]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.5 }}
    >
      <TVFocusGuideView
        trapFocusUp
        trapFocusDown
        trapFocusLeft
        trapFocusRight
        style={styles.overlayFocusGuide}
      >
        <View style={styles.overlayHeaderRow}>
          <FocusableIconButton
            name="arrow-back"
            size={ICON_SIZE}
            color="white"
            onPress={onBackPress}
            onFocus={onInteraction}
          />

          {hasNextInPlaylist && (
            <FocusableIconButton
              ref={forwardButtonRef}
              name="play-skip-forward-outline"
              size={ICON_SIZE}
              onPress={onForwardPress}
              onFocus={onInteraction}
            />
          )}
        </View>

        <View style={styles.overlayFooterContainer}>
          <View style={styles.overlayFooterTitleContainer}>
            <ThemedText type="subtitle">
              {showTitle ? `${showTitle} - ${episode?.title}` : episode?.title}
            </ThemedText>
            <ThemedText>{episode?.description}</ThemedText>
          </View>

          <View style={styles.playerControlsContainer}>
            <FocusableIconButton
              ref={playButtonRef}
              hasTVPreferredFocus
              name={isEnded ? "refresh" : isPlaying ? "pause" : "play"}
              size={PLAYER_ICON_SIZE}
              onPress={onPlayPress}
              onFocus={onInteraction}
            />
            <View style={styles.progressContainer}>
              <ThemedText style={styles.progressTimeText}>
                {formatTime(currentTime)}
              </ThemedText>
              <View style={styles.progressBarContainer} onLayout={handleLayout}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: colors.backgroundTop,
                      width: `${progress * 100}%`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarIndicator,
                      { backgroundColor: colors.backgroundTop },
                    ]}
                  />
                </View>
              </View>
              <ThemedText style={styles.progressTimeText}>
                {formatTime(duration)}
              </ThemedText>
            </View>
          </View>
        </View>
      </TVFocusGuideView>
    </AnimatedLinearGradient>
  );
});

PlayerOverlay.displayName = "PlayerOverlay";

const styles = StyleSheet.create({
  overlay: {
    zIndex: 15,
  },
  overlayFocusGuide: {
    flex: 1,
    paddingTop: Spacings.eight,
    paddingHorizontal: Spacings.ten,
    paddingBottom: Spacings.sixteen,
    justifyContent: "space-between",
  },
  overlayHeaderRow: {
    flexDirection: "row",
    gap: Spacings.six,
  },
  overlayFooterTitleContainer: {
    gap: Spacings.one,
  },
  overlayFooterContainer: {
    gap: Spacings.four,
  },
  playerControlsContainer: {
    flexDirection: "row",
    gap: Spacings.two,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    gap: Spacings.two,
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    backgroundColor: "white",
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
  },
  progressBar: {
    height: "100%",
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  progressBarIndicator: {
    height: PROGRESS_BAR_HEIGHT * 3,
    width: PROGRESS_BAR_HEIGHT * 3,
    borderRadius: (PROGRESS_BAR_HEIGHT * 3) / 2,
    transform: [{ translateX: PROGRESS_BAR_HEIGHT * 2 }],
  },
  progressTimeText: {
    width: scaleSize(60),
    textAlign: "center",
  },
});
