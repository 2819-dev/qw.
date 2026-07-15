import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Wordmark from "../ui/Wordmark";
import { NEW_TAB_URL } from "../state/defaults";
import { findWallpaper, wallpaperIsDark } from "../state/wallpapers";
import type { Palette } from "../theme/useTheme";
import type { Space, Tab } from "../state/types";

interface TabOverviewProps {
  visible: boolean;
  theme: Palette;
  groups: Space[]; // [Private, ...spaces]
  activeGroup: Space;
  tabs: Tab[];
  activeTabId: string;
  wallpaperId: string;
  trialing: boolean;
  trialLabel: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onSelectGroup: (id: string) => void;
  onAddSpace: () => void;
  onEditSpace: (id: string) => void;
  onSettings: () => void;
  onUpgrade: () => void;
  onDismiss: () => void;
}

const PRIVATE_ID = "__private__";

export default function TabOverview(props: TabOverviewProps) {
  const {
    visible,
    theme,
    groups,
    activeGroup,
    tabs,
    activeTabId,
    wallpaperId,
    trialing,
    trialLabel,
    onSelectTab,
    onCloseTab,
    onNewTab,
    onSelectGroup,
    onAddSpace,
    onEditSpace,
    onSettings,
    onUpgrade,
    onDismiss,
  } = props;
  const [query, setQuery] = useState("");
  const isPrivate = activeGroup.id === PRIVATE_ID;

  const q = query.trim().toLowerCase();
  const shown = q ? tabs.filter((t) => (t.title + " " + t.url).toLowerCase().includes(q)) : tabs;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
        {/* header: settings · trial */}
        <View style={styles.header}>
          <Pressable onPress={onSettings} hitSlop={8} style={[styles.roundBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.textMuted, fontSize: 16 }}>⚙</Text>
          </Pressable>
          <Pressable
            onPress={onUpgrade}
            style={[styles.trialPill, { borderColor: trialing ? theme.accent : theme.border, backgroundColor: theme.bgElevated }]}
          >
            <Text style={[styles.trialText, { color: trialing ? theme.accent : theme.textMuted }]}>{trialLabel}</Text>
          </Pressable>
        </View>

        {/* search this group's tabs */}
        <View style={styles.searchWrap}>
          <View style={[styles.searchField, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Text style={[styles.searchGlyph, { color: theme.textMuted }]}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={isPrivate ? "Search private tabs" : `Search ${activeGroup.name} tabs`}
              placeholderTextColor={theme.textFaint}
              autoCapitalize="none"
              style={[styles.searchInput, { color: theme.text }]}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Text style={{ color: theme.textFaint, fontSize: 16 }}>×</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* tab grid — swipe a card up to close */}
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {shown.map((tab) => (
            <TabCard
              key={tab.id}
              theme={theme}
              tab={tab}
              active={tab.id === activeTabId}
              accent={isPrivate ? theme.textMuted : activeGroup.color}
              wallpaperId={wallpaperId}
              onSelect={() => {
                onSelectTab(tab.id);
                onDismiss();
              }}
              onClose={() => onCloseTab(tab.id)}
            />
          ))}
          {shown.length === 0 && <Text style={[styles.empty, { color: theme.textFaint }]}>No matching tabs</Text>}
        </ScrollView>

        {/* bottom bar: + · group selector (Private ↔ spaces) · done ✓ */}
        <View style={[styles.bottomBar, { borderTopColor: theme.border }]}>
          <Pressable onPress={onNewTab} hitSlop={8} style={styles.sideBtn}>
            <Text style={{ color: theme.accent, fontSize: 30, fontWeight: "300" }}>＋</Text>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupRow}
            style={styles.groupScroller}
          >
            {groups.map((g) => {
              const active = g.id === activeGroup.id;
              const priv = g.id === PRIVATE_ID;
              return (
                <Pressable
                  key={g.id}
                  onPress={() => onSelectGroup(g.id)}
                  onLongPress={() => !priv && onEditSpace(g.id)}
                  style={[
                    styles.groupPill,
                    {
                      backgroundColor: active ? (priv ? theme.text : g.color) : theme.bgElevated,
                      borderColor: active ? (priv ? theme.text : g.color) : theme.border,
                    },
                  ]}
                >
                  <Text style={styles.groupEmoji}>{g.emoji}</Text>
                  {active && (
                    <Text style={[styles.groupName, { color: priv ? theme.bg : "#fff" }]} numberOfLines={1}>
                      {g.name}
                    </Text>
                  )}
                </Pressable>
              );
            })}
            <Pressable onPress={onAddSpace} style={[styles.groupAdd, { borderColor: theme.border }]}>
              <Text style={{ color: theme.textFaint, fontSize: 16 }}>＋</Text>
            </Pressable>
          </ScrollView>

          <Pressable onPress={onDismiss} hitSlop={8} style={styles.sideBtn}>
            <Text style={[styles.doneCheck, { color: theme.accent }]}>✓</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function TabCard({
  theme,
  tab,
  active,
  accent,
  wallpaperId,
  onSelect,
  onClose,
}: {
  theme: Palette;
  tab: Tab;
  active: boolean;
  accent: string;
  wallpaperId: string;
  onSelect: () => void;
  onClose: () => void;
}) {
  const pan = useRef(new Animated.Value(0)).current;
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy < -6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_e, g) => {
        if (g.dy < 0) pan.setValue(g.dy);
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy < -80) {
          Animated.timing(pan, { toValue: -500, duration: 160, useNativeDriver: true }).start(onClose);
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  const opacity = pan.interpolate({ inputRange: [-200, 0], outputRange: [0, 1], extrapolate: "clamp" });
  const isNew = tab.url === NEW_TAB_URL;
  const letter = (tab.title[0] ?? "•").toUpperCase();

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ translateY: pan }], opacity }]} {...responder.panHandlers}>
      <Pressable
        onPress={onSelect}
        style={[styles.card, { borderColor: active ? accent : theme.border, backgroundColor: theme.bgElevated }]}
      >
        <View style={styles.thumb}>
          {isNew ? (
            <NewTabThumb theme={theme} wallpaperId={wallpaperId} />
          ) : (
            <View style={[styles.thumbFill, styles.thumbCenter, { backgroundColor: theme.bgElevated2 }]}>
              <View style={[styles.siteMark, { backgroundColor: accent }]}>
                <Text style={styles.siteLetter}>{letter}</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.cardFooter}>
          <View style={[styles.fav, { backgroundColor: theme.bgElevated2 }]}>
            <Text style={[styles.favLetter, { color: theme.textMuted }]}>{letter}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
            {isNew ? "New Tab" : tab.title}
          </Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.cardClose}>
            <Text style={{ color: theme.textFaint, fontSize: 16 }}>×</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function NewTabThumb({ theme, wallpaperId }: { theme: Palette; wallpaperId: string }) {
  const wp = findWallpaper(wallpaperId);
  const [c1, c2] = wp.resolve(theme);
  const dark = wallpaperIsDark(wp, theme.isDark);
  return (
    <LinearGradient colors={[c1, c2]} style={styles.thumbFill}>
      <View style={styles.thumbCenter}>
        <Wordmark size={22} color={dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.16)"} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  roundBtn: { width: 34, height: 34, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  trialPill: { flex: 1, borderWidth: 1, borderRadius: 999, paddingVertical: 8, alignItems: "center" },
  trialText: { fontSize: 12.5, fontWeight: "700" },

  searchWrap: { paddingHorizontal: 16, paddingVertical: 8 },
  searchField: { flexDirection: "row", alignItems: "center", height: 40, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, gap: 8 },
  searchGlyph: { fontSize: 18, fontWeight: "700" },
  searchInput: { flex: 1, fontSize: 15 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 20, gap: 14 },
  cardWrap: { width: "47%" },
  card: { borderRadius: 16, borderWidth: 2, overflow: "hidden" },
  thumb: { aspectRatio: 0.78 },
  thumbFill: { flex: 1 },
  thumbCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  siteMark: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  siteLetter: { color: "#fff", fontSize: 22, fontWeight: "800" },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 9, paddingVertical: 8 },
  fav: { width: 18, height: 18, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  favLetter: { fontSize: 10, fontWeight: "700" },
  cardTitle: { flex: 1, fontSize: 12.5, fontWeight: "600" },
  cardClose: { width: 18, alignItems: "center" },
  empty: { width: "100%", textAlign: "center", marginTop: 40, fontSize: 14 },

  bottomBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
  sideBtn: { width: 40, alignItems: "center" },
  doneCheck: { fontSize: 22, fontWeight: "800" },
  groupScroller: { flex: 1 },
  groupRow: { alignItems: "center", gap: 7, paddingHorizontal: 2 },
  groupPill: { flexDirection: "row", alignItems: "center", gap: 6, minWidth: 38, height: 38, paddingHorizontal: 11, borderRadius: 999, borderWidth: 1.5, justifyContent: "center" },
  groupEmoji: { fontSize: 16 },
  groupName: { fontSize: 13, fontWeight: "700", maxWidth: 90 },
  groupAdd: { width: 38, height: 38, borderRadius: 999, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
});
