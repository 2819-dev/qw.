import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabList from "./TabList";
import type { Palette } from "../theme/useTheme";
import type { Space, Tab } from "../state/types";

interface TabSheetProps {
  visible: boolean;
  theme: Palette;
  space: Space;
  tabs: Tab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
  onDismiss: () => void;
}

export default function TabSheet({
  visible,
  theme,
  space,
  tabs,
  activeTabId,
  onSelect,
  onClose,
  onNewTab,
  onDismiss,
}: TabSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss} />
      <SafeAreaView edges={["bottom"]} style={styles.anchor} pointerEvents="box-none">
        <View style={[styles.sheet, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <View style={styles.grabberRow}>
            <View style={[styles.grabber, { backgroundColor: theme.textFaint }]} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerEmoji}>{space.emoji}</Text>
              <Text style={[styles.headerTitle, { color: theme.text }]}>{space.name}</Text>
              <View style={[styles.countPill, { backgroundColor: theme.bgElevated2 }]}>
                <Text style={[styles.countText, { color: theme.textMuted }]}>{tabs.length}</Text>
              </View>
            </View>
            <Pressable onPress={onDismiss} hitSlop={8}>
              <Text style={[styles.done, { color: theme.accent }]}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.listWrap}>
            <TabList
              theme={theme}
              space={space}
              tabs={tabs}
              activeTabId={activeTabId}
              onSelect={(id) => {
                onSelect(id);
                onDismiss();
              }}
              onClose={onClose}
              onNewTab={() => {
                onNewTab();
                onDismiss();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  anchor: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    maxHeight: "78%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  grabberRow: { alignItems: "center", paddingVertical: 8 },
  grabber: { width: 38, height: 5, borderRadius: 3, opacity: 0.7 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, paddingHorizontal: 4 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerEmoji: { fontSize: 18 },
  headerTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  countPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  countText: { fontSize: 12, fontWeight: "700" },
  done: { fontSize: 15, fontWeight: "700" },
  listWrap: { flexShrink: 1 },
});
