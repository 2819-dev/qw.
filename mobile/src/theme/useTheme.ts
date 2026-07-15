import { useColorScheme } from "react-native";
import { activeSpace } from "../state/defaults";
import type { OnboardingPrefs, ThemeMode } from "../state/types";

export interface Palette {
  accent: string;
  accentSoft: string;
  accentGlow: string;
  bg: string;
  bgElevated: string;
  bgElevated2: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  isDark: boolean;
}

// Neutrals pulled straight from the logo: near-black charcoal + clean off-white.
const DARK: Omit<Palette, "accent" | "accentSoft" | "accentGlow" | "isDark"> = {
  bg: "#0e0f12",
  bgElevated: "#17181c",
  bgElevated2: "#212329",
  border: "rgba(255,255,255,0.07)",
  text: "#f5f6f7",
  textMuted: "rgba(245,246,247,0.55)",
  textFaint: "rgba(245,246,247,0.3)",
};

const LIGHT: Omit<Palette, "accent" | "accentSoft" | "accentGlow" | "isDark"> = {
  bg: "#f5f5f6",
  bgElevated: "#ffffff",
  bgElevated2: "#ededf0",
  border: "rgba(15,16,19,0.08)",
  text: "#131417",
  textMuted: "rgba(19,20,23,0.55)",
  textFaint: "rgba(19,20,23,0.32)",
};

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Build a palette for an explicit accent + theme mode (used by previews for arbitrary spaces). */
export function paletteFor(accent: string, themeMode: ThemeMode, systemDark: boolean): Palette {
  const resolvedDark = themeMode === "auto" ? systemDark : themeMode === "dark";
  const base = resolvedDark ? DARK : LIGHT;
  return {
    ...base,
    accent,
    accentSoft: withAlpha(accent, resolvedDark ? 0.18 : 0.12),
    accentGlow: withAlpha(accent, resolvedDark ? 0.28 : 0.2),
    isDark: resolvedDark,
  };
}

export function useTheme(prefs: OnboardingPrefs): Palette {
  const systemScheme = useColorScheme();
  return paletteFor(activeSpace(prefs).color, prefs.themeMode, systemScheme !== "light");
}
