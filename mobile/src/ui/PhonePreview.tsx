import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Wordmark from "./Wordmark";
import { findWallpaper, wallpaperIsDark } from "../state/wallpapers";
import type { Palette } from "../theme/useTheme";
import type { BarPosition, Space } from "../state/types";

interface PhonePreviewProps {
  theme: Palette;
  barPosition: BarPosition;
  space: Space;
  spaces: Space[];
  wallpaperId?: string;
  height?: number;
}

/**
 * A realistic PORTRAIT phone mockup of the actual Safari-style browser: top search bar
 * (with mic), a minimalist new-tab page, and a bottom toolbar. Basically a live screenshot.
 */
export default function PhonePreview({
  theme,
  barPosition,
  space,
  spaces: _spaces,
  wallpaperId = "auto",
  height = 250,
}: PhonePreviewProps) {
  const width = Math.round(height * 0.49);
  const searchBar = <MiniSearch theme={theme} />;

  return (
    <View style={styles.center}>
      <View
        style={[
          styles.body,
          { width, height, borderRadius: width * 0.24, backgroundColor: "#050506", shadowColor: space.color },
        ]}
      >
        <View style={[styles.screen, { borderRadius: width * 0.2, backgroundColor: theme.bg }]}>
          <StatusBar theme={theme} />
          {barPosition === "top" && searchBar}
          <Page theme={theme} wallpaperId={wallpaperId} />
          {barPosition === "bottom" && searchBar}
          <MiniToolbar theme={theme} accent={space.color} />
          <View style={styles.homeRow}>
            <View style={[styles.home, { backgroundColor: theme.textFaint }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function StatusBar({ theme }: { theme: Palette }) {
  return (
    <View style={styles.status}>
      <View style={[styles.statusSide, { backgroundColor: theme.textFaint }]} />
      <View style={styles.island} />
      <View style={[styles.statusSide, { backgroundColor: theme.textFaint }]} />
    </View>
  );
}

function MiniSearch({ theme }: { theme: Palette }) {
  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchField, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <Text style={[styles.searchGlyph, { color: theme.textMuted }]}>⌕</Text>
        <View style={[styles.searchLine, { backgroundColor: theme.textFaint }]} />
        <Text style={[styles.micGlyph, { color: theme.textMuted }]}>🎤</Text>
      </View>
    </View>
  );
}

function MiniToolbar({ theme, accent }: { theme: Palette; accent: string }) {
  return (
    <View style={[styles.toolbar, { borderTopColor: theme.border }]}>
      <Text style={[styles.tbGlyph, { color: theme.text }]}>‹</Text>
      <Text style={[styles.tbGlyph, { color: theme.textFaint }]}>›</Text>
      <Text style={[styles.tbShare, { color: theme.text }]}>↑</Text>
      <Text style={[styles.tbGlyph, { color: theme.text }]}>☆</Text>
      <View style={[styles.tbTabs, { borderColor: theme.text }]}>
        <View style={[styles.tbTabsDot, { backgroundColor: accent }]} />
      </View>
    </View>
  );
}

/** The minimalist qw new-tab page: just the wallpaper and a faint qw. mark. */
function Page({ theme, wallpaperId }: { theme: Palette; wallpaperId: string }) {
  const wp = findWallpaper(wallpaperId);
  const [c1, c2] = wp.resolve(theme);
  const dark = wallpaperIsDark(wp, theme.isDark);
  const markColor = dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)";
  return (
    <LinearGradient colors={[c1, c2]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.page}>
      <View style={styles.pageCenter}>
        <Wordmark size={30} color={markColor} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  body: {
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  screen: { flex: 1, overflow: "hidden" },

  status: { height: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, paddingTop: 4 },
  statusSide: { width: 12, height: 3, borderRadius: 2, opacity: 0.7 },
  island: { width: 26, height: 8, borderRadius: 5, backgroundColor: "#050506" },

  searchRow: { paddingHorizontal: 8, paddingVertical: 5 },
  searchField: { flexDirection: "row", alignItems: "center", height: 20, borderRadius: 8, borderWidth: 1, paddingHorizontal: 6, gap: 5 },
  searchGlyph: { fontSize: 11, fontWeight: "700" },
  searchLine: { flex: 1, height: 3, borderRadius: 2, maxWidth: "60%" },
  micGlyph: { fontSize: 9 },

  page: { flex: 1, marginHorizontal: 6, borderRadius: 12, overflow: "hidden" },
  pageCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingVertical: 5, marginTop: 5, borderTopWidth: StyleSheet.hairlineWidth },
  tbGlyph: { fontSize: 15, fontWeight: "500" },
  tbShare: { fontSize: 12, fontWeight: "700" },
  tbTabs: { width: 12, height: 12, borderRadius: 3, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tbTabsDot: { width: 4, height: 4, borderRadius: 2 },

  homeRow: { alignItems: "center", paddingBottom: 5, paddingTop: 2 },
  home: { width: "30%", height: 3.5, borderRadius: 2 },
});
