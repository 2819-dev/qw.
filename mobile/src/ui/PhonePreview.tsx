import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Wordmark from "./Wordmark";
import type { Palette } from "../theme/useTheme";
import type { BarPosition, Space } from "../state/types";

interface PhonePreviewProps {
  theme: Palette;
  barPosition: BarPosition;
  space: Space;
  spaces: Space[];
  height?: number;
}

/**
 * A realistic PORTRAIT phone mockup — the browser as it actually appears on a phone.
 * Reflects bar position (top/bottom), the active space's color, and the theme.
 */
export default function PhonePreview({ theme, barPosition, space, spaces, height = 250 }: PhonePreviewProps) {
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
          <Page theme={theme} space={space} />
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
          <View style={[styles.lockDot, { backgroundColor: space.color }]} />
          <View style={[styles.addressLine, { backgroundColor: theme.textFaint }]} />
        </View>
        <View style={[styles.tabsBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={[styles.tabsSquare, { borderColor: space.color }]} />
        </View>
      </View>
    </View>
  );
}

/** A realistic qw "new tab" page — the actual logo, a search field, and shortcut tiles. */
function Page({ theme, space }: { theme: Palette; space: Space }) {
  const shortcuts = ["G", "▶", "✉", "♫", "✦", "◎", "★", "◆"];
  return (
    <View style={[styles.page, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={[space.color + "26", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.pageGlow}
      />
      <View style={styles.ntpBrand}>
        <Wordmark size={22} color={theme.text} dotColor={space.color} />
      </View>
      <View style={[styles.ntpSearch, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={[styles.ntpSearchDot, { backgroundColor: theme.textFaint }]} />
        <View style={[styles.ntpSearchLine, { backgroundColor: theme.textFaint }]} />
      </View>
      <View style={styles.ntpGrid}>
        {shortcuts.map((s, i) => (
          <View key={i} style={[styles.ntpTile, { backgroundColor: theme.bgElevated }]}>
            <Text style={[styles.ntpTileGlyph, { color: i === 0 ? space.color : theme.textMuted }]}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
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
  addressPill: { flex: 1, height: 20, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 7 },
  lockDot: { width: 6, height: 6, borderRadius: 3 },
  addressLine: { flex: 1, height: 3, borderRadius: 2, maxWidth: "70%" },
  tabsBtn: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  tabsSquare: { width: 9, height: 9, borderRadius: 2.5, borderWidth: 1.5 },

  page: { flex: 1, margin: 6, borderRadius: 12, overflow: "hidden", alignItems: "center", paddingTop: 20 },
  pageGlow: { position: "absolute", top: 0, left: 0, right: 0, height: "55%" },
  ntpBrand: { marginBottom: 12 },
  ntpSearch: {
    width: "82%",
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  ntpSearchDot: { width: 7, height: 7, borderRadius: 3.5 },
  ntpSearchLine: { flex: 1, height: 3, borderRadius: 2, maxWidth: "55%" },
  ntpGrid: { width: "82%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 8 },
  ntpTile: { width: "22%", aspectRatio: 1, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  ntpTileGlyph: { fontSize: 12, fontWeight: "700" },

  homeRow: { alignItems: "center", paddingBottom: 5, paddingTop: 2 },
  home: { width: "30%", height: 3.5, borderRadius: 2 },
});
