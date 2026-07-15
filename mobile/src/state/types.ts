export type ThemeMode = "light" | "dark" | "auto";
export type BarPosition = "top" | "bottom";
export type ToolbarButtonId = "back" | "forward" | "reload" | "home" | "share" | "bookmark";

export interface ToolbarButton {
  id: ToolbarButtonId;
  icon: string;
  label: string;
}

/** A Zen-style "space": a colored, named context that recolors the whole browser. */
export interface Space {
  id: string;
  name: string;
  emoji: string;
  color: string;
  homepage: string;
}

/** A tab living inside a space. `stack` groups tabs into a collapsible stack. */
export interface Tab {
  id: string;
  title: string;
  url: string;
  pinned: boolean;
  stack?: string;
}

export interface OnboardingPrefs {
  displayName: string;
  barPosition: BarPosition;
  themeMode: ThemeMode;
  spaces: Space[];
  activeSpaceId: string;
  toolbarButtons: ToolbarButtonId[];
  appIconId: string;
  newTabWallpaperId: string;
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
