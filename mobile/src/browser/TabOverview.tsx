import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  spaces: Space[];
  activeSpace: Space;
  tabs: Tab[];
  activeTabId: string;
  wallpaperId: string;
  trialing: boolean;
  trialLabel: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onSwitchSpace: (id: string) => void;
  onAddSpace: () => void;
  onEditSpace: (id: string) => void;
  onSettings: () => void;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export default function TabOverview(props: TabOverviewProps) {
  const {
    visible,
    theme,
    spaces,
    activeSpace,
    tabs,
    activeTabId,
    wallpaperId,
    trialing,
    trialLabel,
    onSelectTab,
    onCloseTab,
    onNewTab,
    onSwitchSpace,
    onAddSpace,
    onEditSpace,
    onSettings,
    onUpgrade,
    onDismiss,
  } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
        {/* header: settings · trial · done */}
        <View style={styles.header}>
          <Pressable onPress={onSettings} hitSlop={8} style={[styles.roundBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.textMuted, fontSize: 16 }}>⚙</Text>
          </Pressable>
          <Pressable
            onPress={onUpgrade}
            style={[
              styles.trialPill,
              { borderColor: trialing ? theme.accent : theme.border, backgroundColor: theme.bgElevated },
            ]}
          >
            <Text style={[styles.trialText, { color: trialing ? theme.accent : theme.textMuted }]}>{trialLabel}</Text>
          </Pressable>
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Text style={[styles.done, { color: theme.accent }]}>Done</Text>
          </Pressable>
        </View>

        {/* tab grid — swipe a card up to close */}
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TabCard
              key={tab.id}
              theme={theme}
              tab={tab}
              active={tab.id === activeTabId}
              accent={activeSpace.color}
              wallpaperId={wallpaperId}
              onSelect={() => {
                onSelectTab(tab.id);
                onDismiss();
              }}
              onClose={() => onCloseTab(tab.id)}
            />
          ))}
        </ScrollView>

        {/* bottom bar: space dropdown · count · new tab */}
        <View style={[styles.bottomBar, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={() => setMenuOpen((v) => !v)}
            style={[styles.spaceBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
          >
            <Text style={styles.spaceEmoji}>{activeSpace.emoji}</Text>
            <Text style={[styles.spaceName, { color: theme.text }]} numberOfLines={1}>
              {activeSpace.name}
            </Text>
            <Text style={{ color: theme.textFaint, fontSize: 11 }}>▾</Text>
          </Pressable>

          <Text style={[styles.count, { color: theme.textMuted }]}>{tabs.length} Tabs</Text>

          <Pressable onPress={onNewTab} hitSlop={8} style={styles.plusBtn}>
            <Text style={{ color: theme.accent, fontSize: 30, fontWeight: "300" }}>＋</Text>
          </Pressable>
        </View>

        {/* space / profile dropdown */}
        {menuOpen && (
          <>
            <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
            <View style={[styles.menu, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
              {spaces.map((s) => {
                const active = s.id === activeSpace.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      onSwitchSpace(s.id);
                      setMenuOpen(false);
                    }}
                    style={styles.menuRow}
                  >
                    <Text style={styles.spaceEmoji}>{s.emoji}</Text>
                    <Text style={[styles.menuName, { color: theme.text }]} numberOfLines={1}>
                      {s.name}
                    </Text>
                    {active && <Text style={{ color: theme.accent, fontWeight: "800" }}>✓</Text>}
                  </Pressable>
                );
              })}
              <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  onEditSpace(activeSpace.id);
                }}
                style={styles.menuRow}
              >
                <Text style={[styles.menuAction, { color: theme.textMuted }]}>Edit “{activeSpace.name}”</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  onAddSpace();
                }}
                style={styles.menuRow}
              >
                <Text style={[styles.menuAction, { color: theme.accent }]}>＋  New space</Text>
              </Pressable>
            </View>
          </>
        )}
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
            <SiteThumb theme={theme} accent={accent} letter={letter} />
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

function SiteThumb({ theme, accent, letter }: { theme: Palette; accent: string; letter: string }) {
  return (
    <View style={[styles.thumbFill, styles.thumbCenter, { backgroundColor: theme.bgElevated2 }]}>
      <View style={[styles.siteMark, { backgroundColor: accent }]}>
        <Text style={styles.siteLetter}>{letter}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  roundBtn: { width: 34, height: 34, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  trialPill: { flex: 1, borderWidth: 1, borderRadius: 999, paddingVertical: 8, alignItems: "center" },
  trialText: { fontSize: 12.5, fontWeight: "700" },
  done: { fontSize: 16, fontWeight: "700" },

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

  bottomBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  spaceBtn: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, maxWidth: "42%" },
  spaceEmoji: { fontSize: 15 },
  spaceName: { fontSize: 13.5, fontWeight: "600", flexShrink: 1 },
  count: { fontSize: 13.5, fontWeight: "600" },
  plusBtn: { width: 44, alignItems: "flex-end" },

  menuBackdrop: { ...StyleSheet.absoluteFillObject },
  menu: {
    position: "absolute",
    left: 16,
    bottom: 64,
    width: 220,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  menuName: { flex: 1, fontSize: 14.5, fontWeight: "600" },
  menuDivider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  menuAction: { fontSize: 14, fontWeight: "600" },
});
