import type { OnboardingPrefs, PersistedState, Space, Tab, ToolbarButton } from "./types";

/** Sentinel URL for the native, minimalist qw new-tab page (not a real website). */
export const NEW_TAB_URL = "qw://newtab";

/** Curated spaces people pick from (Zen-style: color + emoji + identity). New tabs open the qw page. */
export const SPACE_PRESETS: Space[] = [
  { id: "personal", name: "Personal", emoji: "🏡", color: "#7c6cf6", homepage: NEW_TAB_URL },
  { id: "work", name: "Work", emoji: "💼", color: "#3aa8ff", homepage: NEW_TAB_URL },
  { id: "study", name: "Study", emoji: "📚", color: "#2fd6a5", homepage: NEW_TAB_URL },
  { id: "create", name: "Create", emoji: "🎨", color: "#ff6b5e", homepage: NEW_TAB_URL },
  { id: "play", name: "Play", emoji: "🎮", color: "#f5a623", homepage: NEW_TAB_URL },
  { id: "focus", name: "Focus", emoji: "🎯", color: "#e05299", homepage: NEW_TAB_URL },
];

/**
 * Seed tabs for a space. The active tab is a fresh qw new-tab (minimalist page),
 * followed by a few pinned essentials and a stack — so it feels real without dumping
 * you onto google.com.
 */
export function seedTabs(spaceId: string): Tab[] {
  const newTab: Tab = { id: `${spaceId}-new`, title: "New Tab", url: NEW_TAB_URL, pinned: false };
  const essentials: Tab[] = [
    { id: `${spaceId}-e1`, title: "Search", url: "https://www.google.com", pinned: true },
    { id: `${spaceId}-e2`, title: "Mail", url: "https://mail.google.com", pinned: true },
    { id: `${spaceId}-e3`, title: "Calendar", url: "https://calendar.google.com", pinned: true },
  ];
  const bySpace: Record<string, Tab[]> = {
    work: [
      { id: "work-t1", title: "Docs", url: "https://docs.google.com", pinned: false, stack: "Project" },
      { id: "work-t2", title: "Sheets", url: "https://sheets.google.com", pinned: false, stack: "Project" },
      { id: "work-t3", title: "Drive", url: "https://drive.google.com", pinned: false, stack: "Project" },
    ],
    study: [
      { id: "study-t1", title: "Wikipedia", url: "https://www.wikipedia.org", pinned: false, stack: "Research" },
      { id: "study-t2", title: "Scholar", url: "https://scholar.google.com", pinned: false, stack: "Research" },
    ],
  };
  return [newTab, ...essentials, ...(bySpace[spaceId] ?? [])];
}

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
  barPosition: "top",
  themeMode: "auto",
  spaces: [SPACE_PRESETS[0]],
  activeSpaceId: SPACE_PRESETS[0].id,
  toolbarButtons: ["back", "forward", "reload", "share"],
  appIconId: "default",
  newTabWallpaperId: "auto",
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

/** Helper: the currently active space, falling back to the first. */
export function activeSpace(prefs: OnboardingPrefs): Space {
  return prefs.spaces.find((s) => s.id === prefs.activeSpaceId) ?? prefs.spaces[0] ?? SPACE_PRESETS[0];
}
