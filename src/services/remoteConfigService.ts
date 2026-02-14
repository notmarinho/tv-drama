import {
  getRemoteConfig,
  setDefaults,
  fetchAndActivate,
  getValue,
  setConfigSettings,
} from "@react-native-firebase/remote-config";
import { useHomeLayoutStore } from "@/stores/homeLayoutStore";
import type { HomeLayout } from "@/lib/types";
import layoutJson from "@/lib/api/home-layout/home-layout.json";

const HOME_LAYOUT_KEY = "home_layout";

/**
 * Sets default values for remote config.
 * Uses the bundled home-layout.json as fallback.
 */
export async function setRemoteConfigDefaults(): Promise<void> {
  const config = getRemoteConfig();
  await setDefaults(config, {
    [HOME_LAYOUT_KEY]: JSON.stringify(layoutJson),
  });
}

/**
 * Fetches and activates remote config, then updates the home layout store.
 * Should be called on app startup.
 */
export async function fetchAndActivateRemoteConfig(): Promise<void> {
  const { setHomeLayout, setLoading } = useHomeLayoutStore.getState();
  setLoading(true);

  try {
    const config = getRemoteConfig();
    setConfigSettings(config, {
      minimumFetchIntervalMillis: 0,
    });
    await fetchAndActivate(config);
    const homeLayoutValue = getValue(config, HOME_LAYOUT_KEY);
    const homeLayoutJson = homeLayoutValue.asString();

    if (homeLayoutJson) {
      const layout: HomeLayout = JSON.parse(homeLayoutJson);
      setHomeLayout(layout);
    }
  } catch (error) {
    console.error("Failed to fetch remote config:", error);
    // Fall back to defaults if available in store
  } finally {
    setLoading(false);
  }
}

/**
 * Refreshes remote config data.
 * Can be called manually to force a refresh.
 */
export async function refreshRemoteConfig(): Promise<void> {
  return fetchAndActivateRemoteConfig();
}

/**
 * Initializes remote config with defaults and fetches latest values.
 * Call this once on app startup.
 */
export async function initializeRemoteConfig(): Promise<void> {
  // await setRemoteConfigDefaults();
  await fetchAndActivateRemoteConfig();
}
