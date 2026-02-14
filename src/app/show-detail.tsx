import { StyleSheet, FlatList, View, TVFocusGuideView } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusedShow } from "@/hooks/useFocusedShow";
import { useInitialFocus } from "@/hooks/useInitialFocus";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Spacings from "@/constants/Spacings";
import { LEFT_PADDING, scaleSize, TOP_PADDING } from "@/constants/Ui";
import { router } from "expo-router";
import { FocusableIconButton } from "@/components/FocusableIconButton";
import EpisodeCard from "@/components/cards/EpisodeCard";
import HeroImage from "@/components/HeroImage";
import { SHOWS_BANNER } from "@/ utils/shows-banner";
import SeasonCard from "@/components/cards/SeasonCard";

const ShowDetail = () => {
  const focusedShow = useFocusedShow();
  const [selectedSeason, setSelectedSeason] = useState(0);

  const season = focusedShow?.seasons || [];
  const hasSeasons = season.length > 0;
  const episodes = hasSeasons ? season[selectedSeason].episodes : [];
  const hasEpisodes = episodes.length > 0;

  const handleOnEpisodePress = useCallback(() => {
    router.push("/player");
  }, []);

  const firstEpisodeRef = useInitialFocus({
    enabled: hasSeasons && hasEpisodes,
  });

  return (
    <TVFocusGuideView style={styles.root}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <FocusableIconButton
                name="arrow-back"
                onPress={() => router.back()}
                hasTVPreferredFocus={false}
              />
              <ThemedText type="title" numberOfLines={1} style={{ flex: 1 }}>
                {focusedShow?.title}
              </ThemedText>
            </View>
            <ThemedText>{focusedShow?.description}</ThemedText>
          </View>
          <View style={styles.headerImage}>
            <HeroImage source={SHOWS_BANNER[focusedShow?.id ?? ""]} />
          </View>
        </View>
        <View style={styles.content}>
          {/* // Season Tabs */}
          <View style={styles.seasonTabs}>
            {season.map((season, index) => (
              <SeasonCard
                key={season.id}
                season={season}
                index={index}
                onPress={() => setSelectedSeason(index)}
                isSelected={selectedSeason === index}
              />
            ))}
          </View>
          {/* // Episode List */}
          {hasSeasons && focusedShow && (
            <FlatList
              horizontal
              data={season[selectedSeason].episodes}
              contentContainerStyle={styles.episodeList}
              initialNumToRender={10}
              renderItem={({ item, index }) => (
                <EpisodeCard
                  ref={index === 0 ? firstEpisodeRef : undefined}
                  show={focusedShow}
                  episode={item}
                  index={index}
                  onPress={handleOnEpisodePress}
                  seasonIndex={selectedSeason}
                />
              )}
            />
          )}
        </View>
      </ThemedView>
    </TVFocusGuideView>
  );
};

export default ShowDetail;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: LEFT_PADDING,
  },
  headerTitleContainer: {
    width: "100%",
    flexDirection: "row",
    gap: Spacings.four,
    alignItems: "center",
  },
  headerContent: {
    paddingTop: TOP_PADDING,
    gap: Spacings.two,
    flex: 1,
  },
  headerImage: {
    flex: 1,
  },
  seasonTabs: {
    flexDirection: "row",
    gap: Spacings.four,
    alignSelf: "flex-start",
    marginLeft: LEFT_PADDING,
    marginBottom: Spacings.two,
  },
  seasonTab: {
    borderBottomWidth: scaleSize(2),
    borderBottomColor: "transparent",
    paddingHorizontal: Spacings.four,
    paddingVertical: Spacings.one,
    borderRadius: scaleSize(100),
  },
  selectedSeasonTab: {
    borderBottomWidth: scaleSize(2),
    borderBottomColor: "white",
  },

  episodeTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacings.one,
  },
  episodeList: {
    gap: Spacings.one,
    paddingVertical: Spacings.four,
    paddingLeft: LEFT_PADDING,
  },
});
