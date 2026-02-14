import { StyleSheet, Text, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { ColorScheme } from "@/constants/Colors";
import { Typography, TypographyScheme } from "@/constants/Typography";

export type ThemedTextProps = TextProps & {
  type?: TypographyScheme;
  color?: ColorScheme;
};

export function ThemedText({
  style,
  type = "default",
  color = "text",
  ...rest
}: ThemedTextProps) {
  const colors = useTheme();
  const fontStyle = Typography[type];

  return (
    <Text
      style={[{ color: color ? colors[color] : colors.text }, fontStyle, style]}
      {...rest}
    />
  );
}
