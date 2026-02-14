import { useCallback, useMemo } from "react";
import { useContinueWatchingStore } from "@/stores/continueWatchingStore";
import type { ContinueWatchingEntry } from "@/lib/types";

const MIN_PROGRESS = 0.05;
const MAX_PROGRESS = 0.95;

function isResumable(entry: ContinueWatchingEntry): boolean {
  if (entry.duration <= 0) return false;
  const progress = entry.currentTime / entry.duration;
  return progress >= MIN_PROGRESS && progress <= MAX_PROGRESS;
}

export const useContinueWatching = () => {
  const rawEntries = useContinueWatchingStore((s) => s.entries);
  const storeSaveProgress = useContinueWatchingStore((s) => s.saveProgress);
  const storeRemoveEntry = useContinueWatchingStore((s) => s.removeEntry);

  const entries = useMemo(
    () =>
      [...rawEntries].filter(isResumable).sort((a, b) => b.updatedAt - a.updatedAt),
    [rawEntries],
  );

  const saveProgress = useCallback(
    (entry: ContinueWatchingEntry) => {
      storeSaveProgress(entry);
    },
    [storeSaveProgress],
  );

  const removeEntry = useCallback(
    (episodeId: string) => {
      storeRemoveEntry(episodeId);
    },
    [storeRemoveEntry],
  );

  /** Returns a 0-1 ratio for a given episode, or 0 if not found.
   *  Episodes past the finish threshold are clamped to 1. */
  const getProgressForEpisode = useCallback(
    (episodeId: string): number => {
      const entry = rawEntries.find((e) => e.episodeId === episodeId);
      if (!entry || entry.duration <= 0) return 0;
      const ratio = entry.currentTime / entry.duration;
      if (ratio < MIN_PROGRESS) return 0;
      if (ratio >= MAX_PROGRESS) return 1;
      return ratio;
    },
    [rawEntries],
  );

  return { entries, saveProgress, removeEntry, getProgressForEpisode };
};
