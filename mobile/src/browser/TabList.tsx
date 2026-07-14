import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Palette } from "../theme/useTheme";
import type { Space, Tab } from "../state/types";

interface TabListProps {
  theme: Palette;
  space: Space;
  tabs: Tab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
}

function faviconLetter(tab: Tab): string {
  return (tab.title[0] ?? "•").toUpperCase();
}

export default function TabList({ theme, space, tabs, activeTabId, onSelect, onClose, onNewTab }: TabListProps) {
  const essentials = tabs.filter((t) => t.pinned);
  const rest = tabs.filter((t) => !t.pinned);

  // group loose tabs by stack
  const stacks = new Map<string, Tab[]>();
  const loose: Tab[] = [];
  for (const t of rest) {
    if (t.stack) {
      if (!stacks.has(t.stack)) stacks.set(t.stack, []);
      stacks.get(t.stack)!.push(t);
    } else {
      loose.push(t);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {essentials.length > 0 && (
        <View style={styles.essentialsRow}>
          {essentials.map((t) => {
            const active = t.id === activeTabId;
            return (
              <Pressable
                key={t.id}
                onPress={() => onSelect(t.id)}
                style={[
                  styles.essential,
                  { backgroundColor: active ? space.color : theme.bgElevated2, borderColor: active ? space.color : theme.border },
                ]}
              >
                <Text style={[styles.essentialLetter, { color: active ? "#fff" : theme.textMuted }]}>
                  {faviconLetter(t)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {[...stacks.entries()].map(([name, group]) => (
        <View key={name} style={[styles.stack, { borderColor: space.color, backgroundColor: theme.bgElevated }]}>
          <Text style={[styles.stackLabel, { color: space.color }]}>{name.toUpperCase()}</Text>
          {group.map((t) => (
            <TabRow
              key={t.id}
              theme={theme}
              space={space}
              tab={t}
              active={t.id === activeTabId}
              onSelect={onSelect}
              onClose={onClose}
            />
          ))}
        </View>
      ))}

      {loose.map((t) => (
        <TabRow
          key={t.id}
          theme={theme}
          space={space}
          tab={t}
          active={t.id === activeTabId}
          onSelect={onSelect}
          onClose={onClose}
        />
      ))}

      <Pressable onPress={onNewTab} style={[styles.newTab, { borderColor: theme.border }]}>
        <Text style={[styles.newTabPlus, { color: theme.textMuted }]}>＋</Text>
        <Text style={[styles.newTabText, { color: theme.textMuted }]}>New tab</Text>
      </Pressable>
    </ScrollView>
  );
}

function TabRow({
  theme,
  space,
  tab,
  active,
  onSelect,
  onClose,
}: {
  theme: Palette;
  space: Space;
  tab: Tab;
  active: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onSelect(tab.id)}
      style={[styles.tabRow, { backgroundColor: active ? space.color : "transparent" }]}
    >
      <View style={[styles.fav, { backgroundColor: active ? "rgba(255,255,255,0.25)" : theme.bgElevated2 }]}>
        <Text style={[styles.favLetter, { color: active ? "#fff" : theme.textMuted }]}>{faviconLetter(tab)}</Text>
      </View>
      <Text style={[styles.tabTitle, { color: active ? "#fff" : theme.text }]} numberOfLines={1}>
        {tab.title}
      </Text>
      <Pressable onPress={() => onClose(tab.id)} hitSlop={8} style={styles.close}>
        <Text style={[styles.closeText, { color: active ? "rgba(255,255,255,0.8)" : theme.textFaint }]}>×</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: 6, paddingBottom: 12 },
  essentialsRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  essential: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  essentialLetter: { fontSize: 16, fontWeight: "700" },
  stack: { borderLeftWidth: 2.5, borderRadius: 10, padding: 8, paddingLeft: 10, gap: 2, marginVertical: 2 },
  stackLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.6, marginBottom: 2 },
  tabRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10 },
  fav: { width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  favLetter: { fontSize: 12, fontWeight: "700" },
  tabTitle: { flex: 1, fontSize: 14, fontWeight: "500" },
  close: { width: 20, alignItems: "center" },
  closeText: { fontSize: 17, fontWeight: "600" },
  newTab: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderStyle: "dashed", marginTop: 4 },
  newTabPlus: { fontSize: 15, fontWeight: "600" },
  newTabText: { fontSize: 13.5, fontWeight: "500" },
});
