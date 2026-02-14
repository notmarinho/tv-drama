import React from "react";
import { View } from "react-native";
import { styles } from "./FocusableCard.styles";
import type { FocusableCardProgressBarProps } from "./FocusableCard.types";

export const FocusableCardProgressBar = React.memo(
  ({
    progress,
    color = "#FF358A",
    trackColor = "rgba(255,255,255,0.25)",
  }: FocusableCardProgressBarProps) => {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    if (clampedProgress <= 0) return null;

    return (
      <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${clampedProgress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    );
  },
);

FocusableCardProgressBar.displayName = "FocusableCardProgressBar";
