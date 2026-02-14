import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    newArchEnabled: true,
    name: "Drama TV",
    slug: "drama-tv",
    scheme: "drama-tv",
    plugins: [
      [
        "@react-native-tvos/config-tv",
        {
          androidTVBanner: "./assets/tv_icons/icon-400x240.png",
          appleTVImages: {
            icon: "./assets/tv_icons/icon-1280x768.png",
            iconSmall: "./assets/tv_icons/icon-400x240.png",
            iconSmall2x: "./assets/tv_icons/icon-800x480.png",
            topShelf: "./assets/tv_icons/icon-1920x720.png",
            topShelf2x: "./assets/tv_icons/icon-3840x1440.png",
            topShelfWide: "./assets/tv_icons/icon-2320x720.png",
            topShelfWide2x: "./assets/tv_icons/icon-4640x1440.png",
          },
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: ["RNFBApp", "RNFBAuth", "RNFBFirestore"],
          },
        },
      ],
      ["expo-router", { root: "./src/app" }],
      "@react-native-firebase/app",
      "expo-video",
      "expo-font",
      "expo-build-properties",
      "expo-web-browser",
    ],
    android: {
      edgeToEdgeEnabled: true,
      package: "com.mateussantos.dramatv",
      googleServicesFile: "./assets/config/google-services.json",
      splash: {
        image: "./assets/images/splash.png",
        backgroundColor: "#150A35",
      },
    },
    ios: {
      googleServicesFile: "./assets/config/GoogleService-Info.plist",
      bundleIdentifier: "com.mateussantos.dramatv",
      icon: "./assets/images/icon.png",
      splash: {
        image: "./assets/images/splash.png",
        backgroundColor: "#150A35",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png",
      output: "static",
    },
    experiments: {
      typedRoutes: true,
    },
  };
};
