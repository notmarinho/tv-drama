import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  PressableProps,
  StyleProp,
  TargetedEvent,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import React, { useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Spacings from "@/constants/Spacings";
import { scaleSize } from "@/constants/Ui";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export type IoniconsName = keyof typeof Ionicons.glyphMap;

type FocusableIconButtonProps = PressableProps & {
  name: IoniconsName;
  size?: number;
  color?: string;
  focusScale?: number;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = scaleSize(20);

export const FocusableIconButton = React.memo(
  React.forwardRef<View, FocusableIconButtonProps>(
    (
      {
        name,
        size = ICON_SIZE,
        color,
        focusScale = 1.1,
        style,
        onFocus,
        onBlur,
        onPress,
        ...props
      },
      ref,
    ) => {
      const scale = useSharedValue(1);

      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        alignSelf: "flex-start",
        backgroundColor: interpolateColor(
          scale.value,
          [1, 1.1],
          ["transparent", "#ffffff"],
        ),
      }));

      const animatedIconProps = useAnimatedProps(() => ({
        color: interpolateColor(
          scale.value,
          [1, focusScale],
          ["#ffffff", "#000000"],
        ),
      }));

      const handleOnFocus = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) => {
          scale.value = withTiming(focusScale);
          onFocus?.(event);
        },
        [focusScale, onFocus, scale],
      );

      const handleOnBlur = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) => {
          scale.value = withTiming(1);
          onBlur?.(event);
        },
        [onBlur, scale],
      );

      const handleOnPress = useCallback(
        (event: GestureResponderEvent) => {
          onPress?.(event);
        },
        [onPress],
      );

      return (
        <AnimatedPressable
          ref={ref}
          onPress={handleOnPress}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          style={[animatedStyle, style, styles.container]}
          {...props}
        >
          <AnimatedIcon
            name={name}
            size={size}
            animatedProps={animatedIconProps}
          />
        </AnimatedPressable>
      );
    },
  ),
);

FocusableIconButton.displayName = "FocusableIconButton";

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacings.two,
  },
});
