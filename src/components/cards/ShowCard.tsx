import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { FocusableCard } from "@/components/cards/FocusableCard";
import { useFocusStore } from "@/stores/focusStore";
import { Show } from "@/lib/types";
import { SHOWS_BANNER } from "@/ utils/shows-banner";

export const ShowCard = React.memo(function ShowCard({
  item,
  onPress,
  style,
}: {
  item: Show;
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const setFocusedShow = useFocusStore((s) => s.setFocusedShow);

  const handleOnFocus = useCallback(() => {
    setFocusedShow(item);
  }, [setFocusedShow, item]);

  return (
    <FocusableCard onPress={onPress} onFocus={handleOnFocus} style={style}>
      <FocusableCard.Image source={SHOWS_BANNER[item.id]} contentFit="cover" />
    </FocusableCard>
  );
});
