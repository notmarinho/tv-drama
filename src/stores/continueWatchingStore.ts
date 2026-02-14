import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import type { ContinueWatchingEntry } from "@/lib/types";

type ContinueWatchingState = {
  entries: ContinueWatchingEntry[];
  saveProgress: (entry: ContinueWatchingEntry) => void;
  removeEntry: (episodeId: string) => void;
};

export const useContinueWatchingStore = create<ContinueWatchingState>()(
  persist(
    (set) => ({
      entries: [],
      saveProgress: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries.filter((e) => e.episodeId !== entry.episodeId),
            { ...entry, updatedAt: Date.now() },
          ],
        })),
      removeEntry: (episodeId) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.episodeId !== episodeId),
        })),
    }),
    {
      name: "continue-watching-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
