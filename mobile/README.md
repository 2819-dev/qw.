# qw. — mobile

The primary target for qw right now: an iPhone-first customizable browser, built with Expo/React Native.
Rendering goes through `react-native-webview`, which on iOS is backed by WKWebView — Apple requires every
iOS browser to use WebKit, so this isn't a Chromium browser on this platform. The Chromium/Electron desktop
version (`../electron`, `../src`) is a separate, later phase of the same product.

## What's here

A premium, mobile-first experience built around **spaces** — each a named, colored context (Work, Study,
Personal…) that recolors the browser — plus **tab stacks** and a **top-or-bottom search bar**. The visual
system is tied to the `qw.` logo: near-black + off-white, heavy type, color used as a restrained accent.

- `src/onboarding/` — welcome, search-bar position (top/bottom), appearance, toolbar, personalize, summary.
  Every step renders a live **portrait phone mockup** (`src/ui/PhonePreview.tsx`) — status bar, dynamic
  island, home indicator, and a realistic qw **new-tab page** (the actual logo, search field, shortcut
  tiles) — so people see how it looks on an actual phone. Premium chrome via `OnboardingLayout` (wordmark,
  segmented progress, full-width CTA). Spaces are **not** set up here — you add and customize them in the
  app itself.
- `src/paywall/` — `qw. Pro` upsell with a portrait preview and the honest day 1 / day 5 / day 7 trial
  timeline plus a plain free exit.
- `src/browser/` — the real shell: a chrome bar (spaces switcher + `AddressBar` with a tabs button) pinned
  **top or bottom**, a floating rounded page, a `TabSheet` bottom sheet with essentials + tab stacks
  (`TabList`), and `react-native-webview`. Accent follows the active space. Tap `+` to add a space; tap the
  active space (or long-press any) to open `SpaceEditor` (rename / emoji / color / delete).
- `src/settings/` — Settings modal (⚙ in the chrome). Its centerpiece is the **App Icon picker**.
- `src/ui/Wordmark.tsx` — the reusable `qw.` mark (heavy weight, tight tracking) used across the app.

### App icons

`src/icons/catalog.ts` defines the variants, backed by the real artwork in `assets/app-icons/`
(`light-<id>.png` / `dark-<id>.png`). Free: Classic, Sky Blue, Gold. Pro: Sunset, Gradient Blue, Minimal.
Each has a light and a dark version; the app follows the **device's system appearance** to show the right
one. In the picker (`AppIconTile`) every icon renders **split** — left half light, right half dark. Pro
variants are gated behind an active trial/subscription.

> Selecting an icon persists the choice now. Actually swapping the **home-screen** icon is a native
> capability (iOS alternate icons) that Expo Go can't preview — it activates in a dev/production build
> (add `expo-alternate-app-icons` + list the `assets/app-icons` files in `app.json`).

Theme accent derives from the active space's color (`src/theme/useTheme.ts`). State persists via
`@react-native-async-storage/async-storage` (key `qw.state.v4`).

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
