import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Palette } from "../theme/useTheme";

interface BottomToolbarProps {
  theme: Palette;
  accent: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isBookmarked: boolean;
  tabCount: number;
  onBack: () => void;
  onForward: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onTabs: () => void;
  onNewTab: () => void;
}

/** Safari-style bottom toolbar: back · forward · share · bookmark · tabs. */
export default function BottomToolbar({
  theme,
  accent,
  canGoBack,
  canGoForward,
  isBookmarked,
  tabCount,
  onBack,
  onForward,
  onShare,
  onBookmark,
  onTabs,
  onNewTab,
}: BottomToolbarProps) {
  return (
    <View style={[styles.bar, { borderTopColor: theme.border }]}>
      <Pressable onPress={onBack} disabled={!canGoBack} hitSlop={6} style={styles.btn}>
        <Text style={[styles.glyph, { color: canGoBack ? theme.text : theme.textFaint }]}>‹</Text>
      </Pressable>
      <Pressable onPress={onForward} disabled={!canGoForward} hitSlop={6} style={styles.btn}>
        <Text style={[styles.glyph, { color: canGoForward ? theme.text : theme.textFaint }]}>›</Text>
      </Pressable>
      <Pressable onPress={onShare} hitSlop={6} style={styles.btn}>
        <Text style={[styles.share, { color: theme.text }]}>↑</Text>
      </Pressable>
      <Pressable onPress={onBookmark} hitSlop={6} style={styles.btn}>
        <Text style={[styles.bookmark, { color: isBookmarked ? accent : theme.text }]}>{isBookmarked ? "★" : "☆"}</Text>
      </Pressable>
      <Pressable onPress={onTabs} onLongPress={onNewTab} hitSlop={6} style={styles.btn}>
        <View style={[styles.tabsBox, { borderColor: theme.text }]}>
          <Text style={[styles.tabsCount, { color: theme.text }]}>{tabCount}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btn: { flex: 1, alignItems: "center", justifyContent: "center", height: 40 },
  glyph: { fontSize: 30, fontWeight: "400", lineHeight: 32 },
  share: { fontSize: 22, fontWeight: "600" },
  bookmark: { fontSize: 22 },
  tabsBox: { minWidth: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  tabsCount: { fontSize: 12, fontWeight: "800" },
});
