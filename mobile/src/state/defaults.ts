import type { OnboardingPrefs, PersistedState, Space, Tab, ToolbarButton } from "./types";

/** Curated spaces people pick from during onboarding (Zen-style: color + emoji + identity). */
export const SPACE_PRESETS: Space[] = [
  { id: "personal", name: "Personal", emoji: "🏡", color: "#7c6cf6", homepage: "https://www.google.com" },
  { id: "work", name: "Work", emoji: "💼", color: "#3aa8ff", homepage: "https://www.google.com" },
  { id: "study", name: "Study", emoji: "📚", color: "#2fd6a5", homepage: "https://www.google.com" },
  { id: "create", name: "Create", emoji: "🎨", color: "#ff6b5e", homepage: "https://www.google.com" },
  { id: "play", name: "Play", emoji: "🎮", color: "#f5a623", homepage: "https://www.youtube.com" },
  { id: "focus", name: "Focus", emoji: "🎯", color: "#e05299", homepage: "https://www.google.com" },
];

/** Seed tabs so a fresh space feels real — essentials (pinned) plus a stack of related tabs. */
export function seedTabs(spaceId: string): Tab[] {
  const common: Tab[] = [
    { id: `${spaceId}-e1`, title: "Search", url: "https://www.google.com", pinned: true },
    { id: `${spaceId}-e2`, title: "Mail", url: "https://mail.google.com", pinned: true },
    { id: `${spaceId}-e3`, title: "Calendar", url: "https://calendar.google.com", pinned: true },
  ];
  const bySpace: Record<string, Tab[]> = {
    work: [
      { id: "work-t1", title: "Docs", url: "https://docs.google.com", pinned: false, stack: "Project" },
      { id: "work-t2", title: "Sheets", url: "https://sheets.google.com", pinned: false, stack: "Project" },
      { id: "work-t3", title: "Drive", url: "https://drive.google.com", pinned: false, stack: "Project" },
      { id: "work-t4", title: "Inbox", url: "https://mail.google.com", pinned: false },
    ],
    study: [
      { id: "study-t1", title: "Wikipedia", url: "https://www.wikipedia.org", pinned: false, stack: "Research" },
      { id: "study-t2", title: "Scholar", url: "https://scholar.google.com", pinned: false, stack: "Research" },
      { id: "study-t3", title: "Notes", url: "https://keep.google.com", pinned: false },
    ],
    play: [
      { id: "play-t1", title: "YouTube", url: "https://www.youtube.com", pinned: false },
      { id: "play-t2", title: "Twitch", url: "https://www.twitch.tv", pinned: false },
    ],
  };
  return [...common, ...(bySpace[spaceId] ?? [
    { id: `${spaceId}-t1`, title: "New Tab", url: "https://www.google.com", pinned: false },
    { id: `${spaceId}-t2`, title: "News", url: "https://news.google.com", pinned: false },
  ])];
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
