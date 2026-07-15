import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Wordmark from "../ui/Wordmark";
import { findWallpaper, wallpaperIsDark } from "../state/wallpapers";
import type { Palette } from "../theme/useTheme";

interface NewTabPageProps {
  theme: Palette;
  wallpaperId: string;
}

/**
 * The qw new tab: deliberately minimal. Just the wallpaper (adaptive black/white by
 * default, or a chosen background) and a faint qw. mark. The search bar lives in the
 * chrome, wherever you placed it — nothing else competes with it.
 */
export default function NewTabPage({ theme, wallpaperId }: NewTabPageProps) {
  const wp = findWallpaper(wallpaperId);
  const [c1, c2] = wp.resolve(theme);
  const dark = wallpaperIsDark(wp, theme.isDark);
  const markColor = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";

  return (
    <LinearGradient colors={[c1, c2]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.fill}>
      <View style={styles.center}>
        <Wordmark size={52} color={markColor} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
