import { Image } from "expo-image";
import { Platform } from "react-native";
import { styles } from "./FocusableCard.styles";
import type { FocusableCardImageProps } from "./FocusableCard.types";

const FALLBACK_VERTICAL = require("@/assets/images/fallback_vertical.png");

export function FocusableCardImage({ style, ...props }: FocusableCardImageProps) {
  return (
    <Image
      style={[styles.image, style]}
      transition={Platform.select({ ios: 300, android: 0, default: 0 })}
      placeholder={FALLBACK_VERTICAL}
      placeholderContentFit="cover"
      {...props}
    />
  );
}
