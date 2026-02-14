import { View } from "react-native";
import React, { useCallback, useMemo, forwardRef } from "react";
import { useFocusStore } from "@/stores/focusStore";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { Show, VideoItem } from "@/lib/types";
import { FocusableCard } from "./FocusableCard";

type EpisodeCardProps = {
  show: Show;
  episode: VideoItem;
  index: number;
  onPress: () => void;
  seasonIndex: number;
};

const EpisodeCard = React.memo(
  forwardRef<View, EpisodeCardProps>(
    ({ show, episode, index, onPress, seasonIndex }, ref) => {
      const setFocusedEpisode = useFocusStore((s) => s.setFocusedEpisode);
      const { getProgressForEpisode } = useContinueWatching();

      const progress = useMemo(
        () => getProgressForEpisode(episode.id),
        [getProgressForEpisode, episode.id],
      );

      const handleOnPress = useCallback(() => {
        setFocusedEpisode({
          show,
          seasonIndex,
          episode,
        });
        onPress();
      }, [setFocusedEpisode, show, seasonIndex, episode, onPress]);

      return (
        <FocusableCard
          ref={ref}
          onPress={handleOnPress}
          hasTVPreferredFocus={index === 0}
        >
          <FocusableCard.Image source={episode.poster} contentFit="cover" />
          <FocusableCard.ProgressBar progress={progress} />
        </FocusableCard>
      );
    },
  ),
);

EpisodeCard.displayName = "EpisodeCard";

export default EpisodeCard;
