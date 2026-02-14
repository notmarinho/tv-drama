import React, { useCallback, forwardRef } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Spacings from "@/constants/Spacings";
import { styles } from "./FocusableCard.styles";
import type { FocusableCardProps } from "./FocusableCard.types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FocusableCardRoot = forwardRef<View, FocusableCardProps>(
  ({ children, onPress, onFocus, onBlur, style, hasTVPreferredFocus }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      borderColor: interpolateColor(
        scale.value,
        [1, 1.05],
        ["transparent", "#ffffff"],
      ),
      marginHorizontal: interpolate(
        scale.value,
        [1, 1.1],
        [Spacings.half, Spacings.two],
      ),
    }));

    const handleOnFocus = useCallback(() => {
      scale.value = withTiming(1.1);
      onFocus?.();
    }, [onFocus]);

    const handleOnBlur = useCallback(() => {
      scale.value = withTiming(1);
      onBlur?.();
    }, [onBlur]);

    const containerStyle = [styles.root, animatedStyle, style];

    return (
      <AnimatedPressable
        ref={ref}
        style={containerStyle}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onPress={onPress}
        hasTVPreferredFocus={hasTVPreferredFocus}
      >
        {children}
      </AnimatedPressable>
    );
  },
);

FocusableCardRoot.displayName = "FocusableCard";
