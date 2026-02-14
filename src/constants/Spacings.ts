import { Dimensions, Platform } from "react-native";

export const scale = Platform.isTV ? Dimensions.get("window").width / 1000 : 1;

const Spacings = {
  half: 2 * scale,
  one: 4 * scale,
  two: 8 * scale,
  three: 12 * scale,
  four: 16 * scale,
  five: 20 * scale,
  six: 24 * scale,
  seven: 28 * scale,
  eight: 32 * scale,
  nine: 36 * scale,
  ten: 40 * scale,
  twelve: 48 * scale,
  sixteen: 64 * scale,
};

export default Spacings;
