import { StyleSheet } from "react-native";
import {
  SHOW_CARD_WIDTH,
  SHOW_CARD_HEIGHT,
  SHOW_CARD_BORDER,
  SHOW_CARD_RADIUS,
  scaleSize,
} from "@/constants/Ui";

export const PROGRESS_BAR_HEIGHT = scaleSize(3);

export const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    borderColor: "transparent",
    width: SHOW_CARD_WIDTH,
    height: SHOW_CARD_HEIGHT,
    borderWidth: SHOW_CARD_BORDER,
    borderRadius: SHOW_CARD_RADIUS,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    flex: 1,
  },
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: PROGRESS_BAR_HEIGHT,
  },
  progressFill: {
    height: "100%",
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
  },
});
