import { create } from "zustand";
import type { FocusedEpisode, Show } from "@/lib/types";

type FocusState = {
  focusedShow: Show | null;
  focusedEpisode: FocusedEpisode | null;
  setFocusedShow: (show: Show | null) => void;
  setFocusedEpisode: (episode: FocusedEpisode | null) => void;
};

export const useFocusStore = create<FocusState>((set) => ({
  focusedShow: null,
  focusedEpisode: null,
  setFocusedShow: (show) => set({ focusedShow: show }),
  setFocusedEpisode: (episode) => set({ focusedEpisode: episode }),
}));
