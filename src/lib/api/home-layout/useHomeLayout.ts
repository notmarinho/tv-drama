import { useMemo } from "react";
import { useHomeLayoutStore } from "@/stores/homeLayoutStore";
import { useContinueWatchingStore } from "@/stores/continueWatchingStore";
import type {
  ContinueWatchingEntry,
  HomeLayout,
  HomeLayoutRow,
  Show,
} from "@/lib/types";

const MIN_PROGRESS = 0.05;
const MAX_PROGRESS = 0.95;

function isResumable(entry: ContinueWatchingEntry): boolean {
  if (entry.duration <= 0) return false;
  const progress = entry.currentTime / entry.duration;
  return progress >= MIN_PROGRESS && progress <= MAX_PROGRESS;
}

export const useHomeLayout = () => {
  const homeLayout = useHomeLayoutStore((s) => s.homeLayout);
  const isLoading = useHomeLayoutStore((s) => s.isLoading);
  const rawEntries = useContinueWatchingStore((s) => s.entries);

  const entries = useMemo(
    () =>
      [...rawEntries]
        .filter(isResumable)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [rawEntries],
  );

  const data = useMemo<HomeLayout>(() => {
    const baseRows = homeLayout?.rows;
    if (!baseRows || baseRows.length === 0) return homeLayout;

    if (entries.length === 0) return homeLayout;

    // Build a lookup of all shows by id across every row
    const showMap = new Map<string, Show>();
    for (const row of baseRows) {
      for (const show of row.shows) {
        showMap.set(show.id, show);
      }
    }

    // Collect unique shows that have continue-watching entries
    const seenShowIds = new Set<string>();
    const continueShows: Show[] = [];

    for (const entry of entries) {
      if (seenShowIds.has(entry.showId)) continue;
      const show = showMap.get(entry.showId);
      if (show) {
        seenShowIds.add(entry.showId);
        continueShows.push(show);
      }
    }

    if (continueShows.length === 0) return homeLayout;

    const continueRow: HomeLayoutRow = {
      id: "@continue-watching",
      title: "Continue Watching",
      shows: continueShows,
    };

    return { rows: [continueRow, ...baseRows] };
  }, [homeLayout, entries]);

  return { data, isLoading };
};
