import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { ShowSeason } from "@/lib/types";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Typography } from "@/constants/Typography";
import { LEFT_PADDING, scaleSize } from "@/constants/Ui";
import Spacings from "@/constants/Spacings";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SeasonCard = ({
  season,
  index,
  onPress,
  isSelected,
}: {
  season: ShowSeason;
  index: number;
  onPress: () => void;
  isSelected: boolean;
}) => {
  const isFocused = useSharedValue(0);

  const handleOnFocus = useCallback(() => {
    isFocused.value = withTiming(1);
  }, []);

  const handleOnBlur = useCallback(() => {
    isFocused.value = withTiming(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isFocused.value,
      [0, 1],
      ["transparent", "white"],
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(isFocused.value, [0, 1], ["white", "black"]),
  }));

  return (
    <AnimatedPressable
      style={[
        styles.seasonTab,
        isSelected && styles.selectedSeasonTab,
        animatedStyle,
      ]}
      onPress={onPress}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
    >
      <Animated.Text style={[animatedTextStyle, { ...Typography.default }]}>
        Season {index + 1}
      </Animated.Text>
    </AnimatedPressable>
  );
};

export default SeasonCard;

const styles = StyleSheet.create({
  seasonTabs: {
    flexDirection: "row",
    gap: Spacings.four,
    alignSelf: "flex-start",
    marginLeft: LEFT_PADDING,
    marginBottom: Spacings.two,
  },
  seasonTab: {
    borderBottomWidth: scaleSize(2),
    borderBottomColor: "transparent",
    paddingHorizontal: Spacings.four,
    paddingVertical: Spacings.one,
    borderRadius: scaleSize(100),
  },
  selectedSeasonTab: {
    borderBottomWidth: scaleSize(2),
    borderBottomColor: "white",
  },
});
