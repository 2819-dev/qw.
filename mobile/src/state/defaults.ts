import type { AccentColor, OnboardingPrefs, PersistedState, ToolbarButton } from "./types";

export const ACCENT_COLORS: AccentColor[] = [
  { id: "violet", label: "Violet", value: "#7c6cf6" },
  { id: "coral", label: "Coral", value: "#ff6b5e" },
  { id: "mint", label: "Mint", value: "#2fd6a5" },
  { id: "amber", label: "Amber", value: "#f5a623" },
  { id: "sky", label: "Sky", value: "#3aa8ff" },
];

export const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { id: "back", icon: "‹", label: "Back" },
  { id: "forward", icon: "›", label: "Forward" },
  { id: "reload", icon: "⟳", label: "Reload" },
  { id: "home", icon: "⌂", label: "Home" },
  { id: "share", icon: "↗", label: "Share" },
  { id: "bookmark", icon: "☆", label: "Bookmark" },
];

export const MIN_TOOLBAR_BUTTONS = 2;
export const MAX_TOOLBAR_BUTTONS = 5;

export const DEFAULT_PREFS: OnboardingPrefs = {
  displayName: "",
  searchBarPosition: "top",
  themeMode: "auto",
  accentColor: ACCENT_COLORS[0],
  tabLayout: "vertical",
  toolbarButtons: ["back", "forward", "reload", "share"],
  homepage: "https://www.google.com",
};

export const DEFAULT_STATE: PersistedState = {
  phase: "onboarding",
  onboardingStep: 0,
  prefs: DEFAULT_PREFS,
  trial: {
    status: "none",
    trialStartedAt: null,
    simulatedDayOffset: 0,
  },
};
