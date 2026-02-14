import React, { useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ShowCard } from "@/components/cards/ShowCard";
import Spacings from "@/constants/Spacings";
import { FlatList, TVFocusGuideView, StyleSheet, Platform } from "react-native";
import {
  SHOW_CARD_BORDER,
  SHOW_CARD_HEIGHT,
  SHOW_CARD_WIDTH,
  LEFT_PADDING,
} from "@/constants/Ui";
import { HomeLayoutRow, Show } from "@/lib/types";

export const SHELF_ROW_HEIGHT =
  SHOW_CARD_HEIGHT + SHOW_CARD_BORDER + SHOW_CARD_BORDER + Spacings.five;

export const ShelfRow = React.memo(function ShelfRow({
  item,
  onPressItem,
}: {
  item: HomeLayoutRow;
  onPressItem: () => void;
}) {
  const renderItem = useCallback(
    ({ item: show }: { item: Show }) => (
      <ShowCard
        item={show}
        onPress={onPressItem}
        style={styles.shelfItemContainer}
      />
    ),
    [onPressItem],
  );

  const keyExtractor = useCallback((show: Show) => show.id, []);

  return (
    <TVFocusGuideView
      autoFocus={Platform.isTVOS}
      trapFocusLeft
      trapFocusRight
      style={styles.rowContainer}
    >
      <ThemedText type="subtitleSemiBold" style={styles.rowTitle}>
        {item.title}
      </ThemedText>
      <FlatList
        data={item.shows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </TVFocusGuideView>
  );
});

const styles = StyleSheet.create({
  rowContainer: {
    marginBottom: Spacings.four,
  },
  rowTitle: {
    paddingHorizontal: LEFT_PADDING,
    marginBottom: Spacings.two,
  },
  shelfItemContainer: {
    height: SHOW_CARD_HEIGHT,
    width: SHOW_CARD_WIDTH,
    borderWidth: SHOW_CARD_BORDER,
  },
  content: {
    paddingHorizontal: LEFT_PADDING,
    height: SHELF_ROW_HEIGHT,
    width: "100%",
    alignItems: "center",
  },
});
