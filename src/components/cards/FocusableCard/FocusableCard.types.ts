import type { StyleProp, ViewStyle, ImageStyle } from "react-native";
import type { ImageProps } from "expo-image";

export type FocusableCardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
  hasTVPreferredFocus?: boolean;
};

export type FocusableCardImageProps = Omit<ImageProps, "style"> & {
  style?: StyleProp<ImageStyle>;
};

export type FocusableCardProgressBarProps = {
  /** Value between 0 and 1 */
  progress: number;
  color?: string;
  trackColor?: string;
};

export type FocusableCardComponent = React.ForwardRefExoticComponent<
  FocusableCardProps & React.RefAttributes<import("react-native").View>
> & {
  Image: React.ComponentType<FocusableCardImageProps>;
  ProgressBar: React.ComponentType<FocusableCardProgressBarProps>;
};
