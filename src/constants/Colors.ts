/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    text: "#FFFFFF",
    background: "#150A35",
    backgroundTop: "#FF358A",
    backgroundNew: "#2BCA46",
    icon: "#687076",
    tabIconDefault: "#687076",
    link: "#0a7ea4",
  },
  dark: {
    text: "#FFFFFF",
    background: "#150A35",
    backgroundTop: "#FF358A",
    backgroundNew: "#2BCA46",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    link: "#0a7ea4",
  },
} as const;

export type ColorScheme = keyof typeof Colors.light & keyof typeof Colors.dark;
