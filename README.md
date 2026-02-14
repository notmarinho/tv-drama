# Drama TV

https://github.com/user-attachments/assets/a3095fc4-69f6-4a29-b7e1-cfabcad5b592

## 🚀 How to use

- `cd` into the project

With Yarn

```sh
yarn
yarn prebuild   # Executes clean Expo prebuild with TV modifications (required first!)
yarn android    # Build for Android TV
yarn ios        # Build and run for Apple TV (uses most recently opened simulator)
```

With NPM

```sh
npm i
npm run prebuild
npm run android
npm run io
```

## Project Decisions

- **Show-detail screen**: A dedicated page-detail screen was added to manage the episodes of each show. This screen lists seasons and episodes for a given show and lets users navigate and select episodes (e.g. for playback or “continue watching”), keeping episode browsing and selection separate from the home layout.
- **Episodes Images**: Since I did not had images for each episode I used a placeholder service to present random images on the espisodes.

## State management

The app uses **Zustand** for global state. There are three stores:

| Store                 | File                                  | Persisted  | Purpose                                                       |
| --------------------- | ------------------------------------- | ---------- | ------------------------------------------------------------- |
| **Focus**             | `src/stores/focusStore.ts`            | No         | Currently focused show and episode (for hero/player context). |
| **Home layout**       | `src/stores/homeLayoutStore.ts`       | Yes (MMKV) | Home rows, loading flag, `lastFetched`.                       |
| **Continue watching** | `src/stores/continueWatchingStore.ts` | Yes (MMKV) | List of watch-progress entries (episode, position, etc.).     |

- **Persistence**: Persisted stores use Zustand’s `persist` middleware with **MMKV** via `src/stores/storage.ts`
