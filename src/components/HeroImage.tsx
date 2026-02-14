import { StyleSheet } from "react-native";
import React from "react";
import { ImageBackground, ImageProps } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";

type HeroImageProps = {
  source: ImageProps["source"];
};

const FALLBACK_HORIZONTAL = require("@/assets/images/fallback_horizontal.png");

const HeroImage = ({ source }: HeroImageProps) => {
  const colors = useTheme();
  return (
    <ImageBackground
      source={source}
      style={styles.image}
      contentFit="cover"
      placeholder={FALLBACK_HORIZONTAL}
      placeholderContentFit="cover"
      transition={300}
    >
      <LinearGradient
        colors={["transparent", colors.background]}
        style={styles.gradient}
        locations={[0, 0.7]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </ImageBackground>
  );
};

export default HeroImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
