# qw. — mobile

The primary target for qw right now: an iPhone-first customizable browser, built with Expo/React Native.
Rendering goes through `react-native-webview`, which on iOS is backed by WKWebView — Apple requires every
iOS browser to use WebKit, so this isn't a Chromium browser on this platform. The Chromium/Electron desktop
version (`../electron`, `../src`) is a separate, later phase of the same product.

## What's here

A Zen-inspired experience built around **spaces** — each a named, colored context (Work, Study, Personal…)
that recolors the whole browser — plus **tab stacks** and a choice of **sidebar or top bar**.

- `src/onboarding/` — welcome, layout (sidebar/top bar), spaces, appearance, toolbar, personalize, summary.
  Every step shows a live realistic mini-browser (`src/ui/BrowserPreview.tsx`) that reflects the choice, so
  people see how it actually looks instead of picking from abstract swatches.
- `src/paywall/` — premium upsell with the day 1 / day 5 / day 7 trial timeline and an honest free exit.
- `src/browser/` — the real shell: space switcher, essentials + tab stacks (`TabList`), a floating rounded
  page area, and `react-native-webview`. The accent follows the active space.

Theme accent is derived from the active space's color (`src/theme/useTheme.ts`). State persists via
`@react-native-async-storage/async-storage` (key `qw.state.v2`).

## Running it — free, no Apple Developer account needed

```bash
npm install
npm start          # or: npx expo start --tunnel  if your phone isn't on the same network
```

Scan the QR code with the **Expo Go** app on your iPhone (free, from the App Store) to see it live. Every
time you want to see a new change, just re-run `npm start` (or leave it running — Metro reloads on save).

`npm run web` renders it in a browser for a quick visual check (the WebView tab itself won't load there —
`react-native-webview` is iOS/Android only — but the rest of the UI does).

A real installable build (TestFlight/App Store) requires a paid Apple Developer account ($99/yr) and is a
separate step (`eas build`) — not needed for day-to-day development or for testing on your own phone via
Expo Go.

## SDK version — deliberately pinned to 54

This project is pinned to Expo SDK 54, not the latest SDK on npm. The Expo Go app on the App Store only
ever supports one SDK at a time, and it lags behind new `expo` package releases — if this project were on
a newer SDK than the published Expo Go app, scanning the QR code would fail with a "you need a newer
version of Expo Go" error even though Expo Go is fully up to date.

Before bumping `expo` to a newer SDK, confirm the Expo Go App Store listing has actually caught up (check
the version shown in the app, or https://expo.dev/go). If you do bump it, the paired `react`,
`react-native`, and `expo-*` versions all need to move together — `npx expo install --fix` normally handles
this, but it depends on network access to Expo's dependency API, which isn't available in every sandbox; if
it fails, pull the exact paired versions from the `expo` package's own `bundledNativeModules.json` for the
target SDK.
