import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import { scaleSize } from "@/constants/Ui";
import { ThemedText } from "@/components/ThemedText";
import Spacings from "@/constants/Spacings";
import { useTheme } from "@/hooks/useTheme";
import { FocusableCardBadgeProps } from "./FocusableCard.types";

const FocusableBadge = ({ isTop, lastSeasonDate }: FocusableCardBadgeProps) => {
  const colors = useTheme();

  const releasedOneMonthAgo =
    lastSeasonDate &&
    new Date(lastSeasonDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const badgeColor = useMemo(() => {
    if (isTop) {
      return colors.backgroundTop;
    }
    if (releasedOneMonthAgo) {
      return colors.backgroundNew;
    }

    return "transparent";
  }, [isTop, releasedOneMonthAgo]);

  const badgeText = useMemo(() => {
    if (isTop) {
      return "TOP";
    }
    if (releasedOneMonthAgo) {
      return "NEW";
    }
    return "";
  }, [isTop, releasedOneMonthAgo]);

  if (!isTop && !releasedOneMonthAgo) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: badgeColor }]}>
      <ThemedText type="badge">{badgeText}</ThemedText>
    </View>
  );
};

export default FocusableBadge;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: scaleSize(12),
    paddingHorizontal: Spacings.two,
    paddingVertical: Spacings.half,
    alignItems: "center",
    justifyContent: "center",
  },
});
