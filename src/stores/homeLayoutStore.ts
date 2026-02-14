import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import type { HomeLayout } from "@/lib/types";

type HomeLayoutState = {
  homeLayout: HomeLayout;
  isLoading: boolean;
  lastFetched: number | null;
  setHomeLayout: (layout: HomeLayout) => void;
  setLoading: (loading: boolean) => void;
};

export const useHomeLayoutStore = create<HomeLayoutState>()(
  persist(
    (set) => ({
      homeLayout: { rows: [] },
      isLoading: true,
      lastFetched: null,
      setHomeLayout: (layout) =>
        set({ homeLayout: layout, lastFetched: Date.now(), isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "home-layout-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        homeLayout: state.homeLayout,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
