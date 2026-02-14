import { TextStyle } from "react-native";
import { scaleSize } from "./Ui";

export type TypographyScheme =
  | "default"
  | "defaultSemiBold"
  | "description"
  | "title"
  | "subtitle"
  | "subtitleSemiBold"
  | "link";

export const Typography: Record<TypographyScheme, TextStyle> = {
  default: {
    fontSize: scaleSize(16),
    lineHeight: scaleSize(24),
  },
  defaultSemiBold: {
    fontSize: scaleSize(16),
    lineHeight: scaleSize(24),
    fontWeight: "600",
  },
  description: {
    fontSize: scaleSize(16),
    lineHeight: scaleSize(20),
    fontWeight: "400",
  },
  title: {
    fontSize: scaleSize(32),
    fontWeight: "bold",
    lineHeight: scaleSize(32),
  },
  subtitle: {
    fontSize: scaleSize(20),
    lineHeight: scaleSize(20),
    fontWeight: "bold",
  },
  subtitleSemiBold: {
    fontSize: scaleSize(18),
    lineHeight: scaleSize(20),
    fontWeight: "600",
  },
  link: {
    lineHeight: scaleSize(30),
    fontSize: scaleSize(16),
  },
};
