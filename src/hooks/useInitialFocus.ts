import { Platform, View } from "react-native";
import { useEffect, useRef, RefObject } from "react";

type FocusableNode = View & {
  requestTVFocus?: () => void;
  focus?: () => void;
};

export type UseInitialFocusOptions = {
  /** When true (and on TV), focus will be requested after delay. */
  enabled: boolean;
  /** Delay in ms before requesting focus. Defaults to 200 on tvOS, 0 on Android TV. */
  delay?: number;
  /** Dependencies that trigger a new focus attempt when they change. */
  deps?: React.DependencyList;
  /** Optional ref to use. If not provided, the hook creates and returns one. */
  ref?: RefObject<FocusableNode | null>;
};

const defaultDelay = Platform.OS === "ios" ? 200 : 0;

/**
 * Requests TV focus on a node when conditions are met. Use for initial focus
 * after mount (e.g. first item in a list, play button when overlay appears).
 * Only runs on TV (Platform.isTV).
 *
 * @returns The ref to attach to the focusable node (either the one passed in or a new one).
 */
export function useInitialFocus<T extends FocusableNode = FocusableNode>(
  options: UseInitialFocusOptions
): RefObject<T | null> {
  const { enabled, deps = [], ref: externalRef } = options;
  const delay = options.delay ?? defaultDelay;

  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useEffect(() => {
    if (!Platform.isTV || !enabled) return;

    const id = setTimeout(() => {
      const node = ref.current as FocusableNode | null;
      if (node?.requestTVFocus) {
        node.requestTVFocus();
      } else if (node?.focus) {
        node.focus();
      }
    }, delay);

    return () => clearTimeout(id);
  }, [enabled, delay, ...deps]);

  return ref;
}
