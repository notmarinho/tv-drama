export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoSource: string;
  poster: string;
}

export type HomeLayoutRow = {
  id: string;
  title: string;
  shows: Show[];
};

export type Show = {
  id: string;
  title: string;
  description: string;
  poster: string;
  heroImage: string;
  releaseDate: string;
  lastSeasonDate: string | null;
  lastEpisodeDate: string | null;
  seasons: ShowSeason[];
  isTop: boolean;
};

export type ShowSeason = {
  id: string;
  description: string;
  episodes: VideoItem[];
};

export type HomeLayout = {
  rows: HomeLayoutRow[];
};

export type ContinueWatchingEntry = {
  showId: string;
  seasonIndex: number;
  episodeId: string;
  currentTime: number; // seconds
  duration: number; // seconds
  updatedAt: number; // Date.now()
};

export type FocusedEpisode = {
  show: Show;
  seasonIndex: number;
  episode: VideoItem;
};
