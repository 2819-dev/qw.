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
 * A realistic PORTRAIT phone mockup — the browser as it actually appears on a phone.
 * The new-tab page is deliberately minimal (wallpaper + a faint qw.), just like the real app.
 */
export default function PhonePreview({
  theme,
  barPosition,
  space,
  spaces,
  wallpaperId = "auto",
  height = 250,
}: PhonePreviewProps) {
  const width = Math.round(height * 0.49);
  const bar = <Chrome theme={theme} space={space} spaces={spaces} />;

  return (
    <View style={styles.center}>
      <View
        style={[
          styles.body,
          {
            width,
            height,
            borderRadius: width * 0.24,
            backgroundColor: "#050506",
            shadowColor: space.color,
          },
        ]}
      >
        <View style={[styles.screen, { borderRadius: width * 0.2, backgroundColor: theme.bg }]}>
          <StatusBar theme={theme} />
          {barPosition === "top" && bar}
          <Page theme={theme} wallpaperId={wallpaperId} />
          {barPosition === "bottom" && bar}
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

function Chrome({ theme, space, spaces }: { theme: Palette; space: Space; spaces: Space[] }) {
  return (
    <View style={styles.chrome}>
      <View style={styles.spacesRow}>
        {spaces.slice(0, 4).map((s) => {
          const active = s.id === space.id;
          return (
            <View
              key={s.id}
              style={[
                styles.spaceDot,
                { backgroundColor: active ? space.color : theme.bgElevated2, borderColor: active ? space.color : "transparent" },
              ]}
            >
              <Text style={styles.spaceEmoji}>{s.emoji}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.addressRow}>
        <View style={[styles.addressPill, { backgroundColor: theme.bgElevated }]}>
          <View style={[styles.addressLine, { backgroundColor: theme.textFaint }]} />
        </View>
        <View style={[styles.tabsBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={[styles.tabsSquare, { borderColor: theme.textMuted }]} />
        </View>
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

  chrome: { paddingHorizontal: 8, paddingVertical: 6, gap: 6 },
  spacesRow: { flexDirection: "row", gap: 5, justifyContent: "center" },
  spaceDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  spaceEmoji: { fontSize: 9 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  addressPill: { flex: 1, height: 20, borderRadius: 999, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  addressLine: { flex: 1, height: 3, borderRadius: 2, maxWidth: "70%" },
  tabsBtn: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  tabsSquare: { width: 9, height: 9, borderRadius: 2.5, borderWidth: 1.5 },

  page: { flex: 1, margin: 6, borderRadius: 12, overflow: "hidden" },
  pageCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

  homeRow: { alignItems: "center", paddingBottom: 5, paddingTop: 2 },
  home: { width: "30%", height: 3.5, borderRadius: 2 },
});
