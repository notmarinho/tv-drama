import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme ?? "light";

  return Colors[theme];
}
