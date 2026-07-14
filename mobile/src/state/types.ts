export type SearchBarPosition = "top" | "bottom";
export type ThemeMode = "light" | "dark" | "auto";
export type TabLayout = "vertical" | "horizontal";
export type ToolbarButtonId = "back" | "forward" | "reload" | "home" | "share" | "bookmark";

export interface AccentColor {
  id: string;
  label: string;
  value: string;
}

export interface ToolbarButton {
  id: ToolbarButtonId;
  icon: string;
  label: string;
}

export interface OnboardingPrefs {
  displayName: string;
  searchBarPosition: SearchBarPosition;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  tabLayout: TabLayout;
  toolbarButtons: ToolbarButtonId[];
  homepage: string;
}

export type AppPhase = "onboarding" | "paywall" | "browser";

export type TrialStatus = "none" | "trialing" | "subscribed" | "declined";

export interface TrialState {
  status: TrialStatus;
  trialStartedAt: number | null;
  /** Dev-only knob to preview day 1/5/7 states without waiting a week. */
  simulatedDayOffset: number;
}

export interface PersistedState {
  phase: AppPhase;
  onboardingStep: number;
  prefs: OnboardingPrefs;
  trial: TrialState;
}
