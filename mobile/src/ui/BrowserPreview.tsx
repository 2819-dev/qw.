import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import type { Palette } from "../theme/useTheme";
import type { BrowserLayout, Space } from "../state/types";

interface BrowserPreviewProps {
  theme: Palette;
  layout: BrowserLayout;
  space: Space;
  spaces: Space[];
  height?: number;
  style?: ViewStyle;
}

/**
 * A realistic-looking miniature of the qw browser chrome, so people can actually see how their
 * choices land — spaces, tab stacks, sidebar vs top bar — instead of abstract swatches.
 */
export default function BrowserPreview({ theme, layout, space, spaces, height = 188, style }: BrowserPreviewProps) {
  const page = <FauxPage theme={theme} space={space} />;

  return (
    <View
      style={[
        styles.frame,
        { height, backgroundColor: theme.bgElevated, borderColor: theme.border },
        style,
      ]}
    >
      {layout === "sidebar" ? (
        <View style={styles.rowFill}>
          <Sidebar theme={theme} space={space} spaces={spaces} />
          <View style={styles.pageWrapSidebar}>{page}</View>
        </View>
      ) : (
        <View style={styles.colFill}>
          <Topbar theme={theme} space={space} spaces={spaces} />
          <View style={styles.pageWrapTop}>{page}</View>
        </View>
      )}
    </View>
  );
}

function SpaceDots({ theme, space, spaces }: { theme: Palette; space: Space; spaces: Space[] }) {
  return (
    <>
      {spaces.slice(0, 4).map((s) => {
        const active = s.id === space.id;
        return (
          <View
            key={s.id}
            style={[
              styles.spaceDot,
              {
                backgroundColor: active ? space.color : theme.bgElevated2,
                borderColor: active ? space.color : "transparent",
              },
            ]}
          >
            <Text style={{ fontSize: 9 }}>{s.emoji}</Text>
          </View>
        );
      })}
    </>
  );
}

function TabRow({ theme, color, active, w }: { theme: Palette; color: string; active?: boolean; w?: number | string }) {
  return (
    <View
      style={[
        styles.tabRow,
        {
          width: (w as ViewStyle["width"]) ?? "100%",
          backgroundColor: active ? color : theme.bgElevated2,
        },
      ]}
    >
      <View style={[styles.tabFav, { backgroundColor: active ? "#fff" : theme.textFaint }]} />
      <View style={[styles.tabLine, { backgroundColor: active ? "#fff" : theme.textFaint }]} />
    </View>
  );
}

function Sidebar({ theme, space, spaces }: { theme: Palette; space: Space; spaces: Space[] }) {
  return (
    <View style={[styles.sidebar, { backgroundColor: theme.bg }]}>
      <View style={styles.spaceRow}>
        <SpaceDots theme={theme} space={space} spaces={spaces} />
      </View>
      <View style={[styles.searchPill, { backgroundColor: theme.bgElevated2 }]}>
        <View style={[styles.searchDot, { backgroundColor: space.color }]} />
      </View>

      {/* essentials */}
      <View style={styles.essentialsRow}>
        <View style={[styles.essential, { backgroundColor: theme.bgElevated2 }]} />
        <View style={[styles.essential, { backgroundColor: theme.bgElevated2 }]} />
        <View style={[styles.essential, { backgroundColor: theme.bgElevated2 }]} />
      </View>

      {/* a tab stack */}
      <View style={[styles.stack, { borderColor: space.color, backgroundColor: theme.bgElevated }]}>
        <TabRow theme={theme} color={space.color} active />
        <TabRow theme={theme} color={space.color} />
      </View>
      <TabRow theme={theme} color={space.color} />
      <TabRow theme={theme} color={space.color} />
    </View>
  );
}

function Topbar({ theme, space, spaces }: { theme: Palette; space: Space; spaces: Space[] }) {
  return (
    <View style={styles.topbarWrap}>
      <View style={[styles.topbar, { backgroundColor: theme.bg }]}>
        <View style={styles.spaceRowH}>
          <SpaceDots theme={theme} space={space} spaces={spaces} />
        </View>
        <View style={styles.winDots}>
          <View style={[styles.winDot, { backgroundColor: theme.textFaint }]} />
          <View style={[styles.winDot, { backgroundColor: theme.textFaint }]} />
        </View>
      </View>
      <View style={[styles.tabStripH, { backgroundColor: theme.bg }]}>
        <TabRow theme={theme} color={space.color} active w={70} />
        <TabRow theme={theme} color={space.color} w={54} />
        <TabRow theme={theme} color={space.color} w={54} />
      </View>
      <View style={[styles.searchPillH, { backgroundColor: theme.bgElevated2 }]}>
        <View style={[styles.searchDot, { backgroundColor: space.color }]} />
      </View>
    </View>
  );
}

function FauxPage({ theme, space }: { theme: Palette; space: Space }) {
  return (
    <View style={[styles.page, { backgroundColor: theme.isDark ? "#0f0f16" : "#ffffff" }]}>
      <LinearGradient
        colors={[space.color, theme.isDark ? "#12121a" : "#f3f3fb"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEmoji}>{space.emoji}</Text>
      </LinearGradient>
      <View style={styles.pageBody}>
        <View style={[styles.pline, { width: "80%", backgroundColor: theme.textFaint }]} />
        <View style={[styles.pline, { width: "62%", backgroundColor: theme.textFaint }]} />
        <View style={styles.cardRow}>
          <View style={[styles.pcard, { backgroundColor: theme.isDark ? "#191922" : "#eef0f6" }]} />
          <View style={[styles.pcard, { backgroundColor: theme.isDark ? "#191922" : "#eef0f6" }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: 18, borderWidth: 1, padding: 7, overflow: "hidden" },
  rowFill: { flex: 1, flexDirection: "row" },
  colFill: { flex: 1 },

  // sidebar
  sidebar: { width: "34%", borderRadius: 12, padding: 6, gap: 5 },
  pageWrapSidebar: { flex: 1, paddingLeft: 6 },
  spaceRow: { flexDirection: "row", gap: 4, marginBottom: 2 },
  searchPill: { height: 14, borderRadius: 999, paddingHorizontal: 5, justifyContent: "center" },
  searchDot: { width: 6, height: 6, borderRadius: 3 },
  essentialsRow: { flexDirection: "row", gap: 4, marginVertical: 1 },
  essential: { flex: 1, height: 16, borderRadius: 5 },
  stack: { borderLeftWidth: 2, borderRadius: 6, padding: 3, gap: 3, marginTop: 1 },
  tabRow: { flexDirection: "row", alignItems: "center", gap: 4, height: 13, borderRadius: 5, paddingHorizontal: 4 },
  tabFav: { width: 5, height: 5, borderRadius: 2.5 },
  tabLine: { flex: 1, height: 3, borderRadius: 2 },

  // space dots
  spaceDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },

  // topbar
  topbarWrap: { gap: 5, marginBottom: 6 },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10, padding: 5 },
  spaceRowH: { flexDirection: "row", gap: 5 },
  winDots: { flexDirection: "row", gap: 4 },
  winDot: { width: 6, height: 6, borderRadius: 3 },
  tabStripH: { flexDirection: "row", gap: 5, borderRadius: 8, padding: 4 },
  searchPillH: { height: 16, borderRadius: 999, paddingHorizontal: 6, justifyContent: "center" },
  pageWrapTop: { flex: 1 },

  // faux page
  page: { flex: 1, borderRadius: 12, overflow: "hidden" },
  hero: { height: "46%", alignItems: "center", justifyContent: "center" },
  heroEmoji: { fontSize: 24 },
  pageBody: { padding: 8, gap: 5 },
  pline: { height: 5, borderRadius: 3 },
  cardRow: { flexDirection: "row", gap: 6, marginTop: 2 },
  pcard: { flex: 1, height: 24, borderRadius: 6 },
});
