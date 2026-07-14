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

const DARK: Omit<Palette, "accent" | "accentSoft" | "accentGlow" | "isDark"> = {
  bg: "#0b0b0f",
  bgElevated: "#17171f",
  bgElevated2: "#1f1f2a",
  border: "rgba(255,255,255,0.1)",
  text: "#f2f2f7",
  textMuted: "rgba(242,242,247,0.6)",
  textFaint: "rgba(242,242,247,0.4)",
};

const LIGHT: Omit<Palette, "accent" | "accentSoft" | "accentGlow" | "isDark"> = {
  bg: "#f4f4f8",
  bgElevated: "#ffffff",
  bgElevated2: "#f0f0f5",
  border: "rgba(10,10,20,0.1)",
  text: "#16161d",
  textMuted: "rgba(22,22,29,0.6)",
  textFaint: "rgba(22,22,29,0.4)",
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
