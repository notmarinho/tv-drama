import { Dimensions, Platform } from "react-native";
import Spacings from "./Spacings";

export const TOP_PADDING = Spacings.eight;
export const LEFT_PADDING = Spacings.ten;
export const RIGHT_PADDING = Spacings.ten;

const SCALE = Platform.isTV ? Dimensions.get("window").width / 1000 : 1;

export const scaleSize = (size: number) => size * SCALE;

export const SHOW_CARD_HEIGHT = scaleSize(190);
export const SHOW_CARD_WIDTH = scaleSize(128);
export const SHOW_CARD_BORDER = scaleSize(2);
export const SHOW_CARD_RADIUS = scaleSize(10);
