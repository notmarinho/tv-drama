import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { scaleSize } from "@/constants/Ui";
import Spacings from "@/constants/Spacings";
import { LEFT_PADDING } from "@/constants/Ui";
import { useFocusedShow } from "@/hooks/useFocusedShow";
import HeroImage from "./HeroImage";
import Animated, { FadeIn } from "react-native-reanimated";
import { Typography } from "@/constants/Typography";
import { useTheme } from "@/hooks/useTheme";
import { SHOWS_BANNER } from "@/ utils/shows-banner";

const LOGO = require("@/assets/images/logo-horizontal.png");

export function HeroHeader() {
  const focusedShow = useFocusedShow();
  const colors = useTheme();
  return (
    <View style={styles.container}>
      <ThemedView style={styles.heroSectionContent}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
        <Animated.Text
          key={focusedShow?.title}
          style={[Typography.subtitle, { color: colors.text }]}
          entering={FadeIn}
        >
          {focusedShow?.title ?? "Select a show"}
        </Animated.Text>
        <Animated.Text
          key={focusedShow?.description}
          style={[Typography.description, { color: colors.text }]}
          entering={FadeIn}
        >
          {focusedShow?.description ??
            "Navigate through the shelves and focus on an item to see the details."}
        </Animated.Text>
      </ThemedView>
      <View style={styles.heroSectionImageContainer}>
        <HeroImage source={SHOWS_BANNER[focusedShow?.id ?? ""]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: scaleSize(250),
    flexDirection: "row",
  },
  logo: {
    height: scaleSize(130) * 0.2,
    width: scaleSize(130),
    marginBottom: Spacings.four,
  },
  heroSection: {
    flexDirection: "row",
    width: "100%",
    height: scaleSize(160),
  },
  heroSectionContent: {
    paddingLeft: LEFT_PADDING,
    paddingTop: Spacings.eight,
    flex: 1,
    gap: Spacings.two,
  },

  heroSectionImageContainer: {
    flex: 1,
  },
});
