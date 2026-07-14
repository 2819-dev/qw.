import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Palette } from "../theme/useTheme";
import type { Space } from "../state/types";

interface SpaceSwitcherProps {
  theme: Palette;
  spaces: Space[];
  activeId: string;
  orientation: "vertical" | "horizontal";
  /** Emoji-only pills (no names) — for the narrow expanded sidebar. */
  compact?: boolean;
  onSelect: (id: string) => void;
}

export default function SpaceSwitcher({ theme, spaces, activeId, orientation, compact, onSelect }: SpaceSwitcherProps) {
  const vertical = orientation === "vertical";
  const showNames = !vertical && !compact;
  return (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={vertical ? undefined : styles.hScroll}
      contentContainerStyle={vertical ? styles.vContent : styles.hContent}
    >
      {spaces.map((s) => {
        const active = s.id === activeId;
        return (
          <Pressable
            key={s.id}
            onPress={() => onSelect(s.id)}
            style={[
              styles.space,
              {
                backgroundColor: active ? s.color : theme.bgElevated2,
                borderColor: active ? s.color : "transparent",
              },
              showNames ? styles.spaceH : null,
            ]}
          >
            <Text style={styles.emoji}>{s.emoji}</Text>
            {showNames && (
              <Text style={[styles.name, { color: active ? "#fff" : theme.textMuted }]} numberOfLines={1}>
                {s.name}
              </Text>
            )}
          </Pressable>
        );
      })}
      <View style={[styles.add, { borderColor: theme.border }]}>
        <Text style={[styles.addText, { color: theme.textFaint }]}>＋</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hScroll: { flexGrow: 0, flexShrink: 0 },
  vContent: { alignItems: "center", gap: 10, paddingVertical: 4 },
  hContent: { alignItems: "center", gap: 8, paddingHorizontal: 2 },
  space: { width: 40, height: 40, borderRadius: 13, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  spaceH: { width: "auto", flexDirection: "row", gap: 6, paddingHorizontal: 12, borderRadius: 999 },
  emoji: { fontSize: 18 },
  name: { fontSize: 13, fontWeight: "600", maxWidth: 90 },
  add: { width: 40, height: 40, borderRadius: 13, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  addText: { fontSize: 18, fontWeight: "600" },
});
