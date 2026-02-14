import { useCallback } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { HeroHeader } from "@/components/HeroHeader";
import { ShelfRow } from "@/components/ShelfRow";
import Spacings from "@/constants/Spacings";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useHomeLayout } from "@/lib/api/home-layout/useHomeLayout";
import { HomeLayoutRow } from "@/lib/types";

export default function HomeScreen() {
  const { data: homeLayout } = useHomeLayout();

  const handlePressItem = useCallback(() => {
    router.push("/show-detail");
  }, []);

  const renderShelfRow = useCallback(
    ({ item }: { item: HomeLayoutRow }) => (
      <ShelfRow item={item} onPressItem={handlePressItem} />
    ),
    [handlePressItem],
  );

  return (
    <ThemedView style={styles.container}>
      <HeroHeader />
      <FlashList
        data={homeLayout?.rows}
        renderItem={renderShelfRow}
        contentContainerStyle={styles.content}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: Spacings.two,
    paddingBottom: Spacings.four,
  },
  shelfItemSeparator: {
    width: Spacings.two,
  },
});
