import { Platform, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { VideoView } from "expo-video";

import { PlayerOverlay } from "@/components/PlayerOverlay";
import { PlayerProvider, usePlayerContext } from "@/contexts/PlayerContext";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";

const isAndroidTV = Platform.isTV && Platform.OS === "android";

const PlayerContent = React.memo(() => {
  const { player, showOverlay, showAndResetOverlay } = usePlayerContext();
  const colors = useTheme();

  const handlePress = useCallback(() => {
    showAndResetOverlay();
  }, [showAndResetOverlay]);

  const VideoWrapper = isAndroidTV ? Pressable : View;
  const videoWrapperProps = isAndroidTV
    ? {
        style: styles.videoContainer,
        focusable: !showOverlay,
        onPress: handlePress,
      }
    : { style: styles.videoContainer };

  return (
    <LinearGradient
      colors={[colors.background, "#090517", colors.background]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      locations={[0, 0.5, 1]}
    >
      <PlayerOverlay />
      <VideoWrapper {...videoWrapperProps}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      </VideoWrapper>
    </LinearGradient>
  );
});

PlayerContent.displayName = "PlayerContent";

const PlayerScreen = () => {
  return (
    <PlayerProvider>
      <PlayerContent />
    </PlayerProvider>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    aspectRatio: 9 / 16,
    height: "100%",
    alignSelf: "center",
    zIndex: 10,
  },
  video: {
    height: "100%",
  },
});
