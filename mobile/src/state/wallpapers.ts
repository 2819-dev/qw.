import type { Palette } from "../theme/useTheme";

export interface Wallpaper {
  id: string;
  name: string;
  isPro: boolean;
  /** "auto" follows the app theme; otherwise the wallpaper fixes its own tone. */
  tone: "auto" | "dark" | "light";
  /** Two colors for a subtle top→bottom gradient (repeat the same for a flat fill). */
  resolve: (theme: Palette) => [string, string];
}

export const WALLPAPERS: Wallpaper[] = [
  { id: "auto", name: "Adaptive", isPro: false, tone: "auto", resolve: (t) => [t.bg, t.bg] },
  { id: "ink", name: "Ink", isPro: false, tone: "dark", resolve: () => ["#0e0f12", "#0e0f12"] },
  { id: "obsidian", name: "Obsidian", isPro: false, tone: "dark", resolve: () => ["#000000", "#0a0a0c"] },
  { id: "paper", name: "Paper", isPro: false, tone: "light", resolve: () => ["#ffffff", "#f1f1f4"] },
  { id: "dusk", name: "Dusk", isPro: true, tone: "dark", resolve: () => ["#191233", "#0b0a18"] },
  { id: "ember", name: "Ember", isPro: true, tone: "dark", resolve: () => ["#241016", "#0d0a0c"] },
  { id: "mist", name: "Mist", isPro: true, tone: "light", resolve: () => ["#eef1f7", "#dfe4ee"] },
];

export const DEFAULT_WALLPAPER_ID = "auto";

export function findWallpaper(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
}

/** True when the wallpaper reads as dark (so foreground text should be light). */
export function wallpaperIsDark(w: Wallpaper, themeIsDark: boolean): boolean {
  return w.tone === "auto" ? themeIsDark : w.tone === "dark";
}
