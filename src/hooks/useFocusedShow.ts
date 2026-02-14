import { useFocusStore } from "@/stores/focusStore";

export const useFocusedShow = () => {
  const focusedShow = useFocusStore((s) => s.focusedShow);
  return focusedShow;
};
