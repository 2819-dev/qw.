import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import { APP_ICONS, type AppIconVariant } from "../icons/catalog";
import { WALLPAPERS, type Wallpaper } from "../state/wallpapers";
import AppIconTile from "../icons/AppIconTile";
import Wordmark from "../ui/Wordmark";

interface SettingsProps {
  visible: boolean;
  onDismiss: () => void;
  onUpgrade: () => void;
}

export default function Settings({ visible, onDismiss, onUpgrade }: SettingsProps) {
  const { state, dispatch } = useAppStore();
  const theme = useTheme(state.prefs);
  const hasPro = state.trial.status === "trialing" || state.trial.status === "subscribed";
  const selectedId = state.prefs.appIconId;
  const selectedWallpaper = state.prefs.newTabWallpaperId;

  function selectIcon(icon: AppIconVariant) {
    if (icon.isPro && !hasPro) {
      onUpgrade();
      return;
    }
    dispatch({ type: "UPDATE_PREFS", prefs: { appIconId: icon.id } });
  }

  function selectWallpaper(wp: Wallpaper) {
    if (wp.isPro && !hasPro) {
      onUpgrade();
      return;
    }
    dispatch({ type: "UPDATE_PREFS", prefs: { newTabWallpaperId: wp.id } });
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Wordmark size={20} color={theme.text} dotColor={theme.accent} />
          <Pressable onPress={onDismiss} hitSlop={10}>
            <Text style={[styles.done, { color: theme.accent }]}>Done</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>New Tab</Text>
          <Text style={[styles.sectionNote, { color: theme.textMuted }]}>
            Your new tab is deliberately bare — just your search bar. Pick its background here.
          </Text>
          <View style={styles.wallpaperGrid}>
            {WALLPAPERS.map((wp) => {
              const selected = wp.id === selectedWallpaper;
              const locked = wp.isPro && !hasPro;
              const [c1, c2] = wp.resolve(theme);
              return (
                <Pressable key={wp.id} onPress={() => selectWallpaper(wp)} style={styles.wallpaperCell}>
                  <LinearGradient
                    colors={[c1, c2]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[
                      styles.wallpaperSwatch,
                      { borderColor: selected ? theme.accent : theme.border, borderWidth: selected ? 2.5 : 1 },
                    ]}
                  >
                    {selected && (
                      <View style={[styles.wpCheck, { backgroundColor: theme.accent }]}>
                        <Text style={styles.wpCheckMark}>✓</Text>
                      </View>
                    )}
                    {locked && <Text style={styles.wpLock}>🔒</Text>}
                  </LinearGradient>
                  <View style={styles.wpNameRow}>
                    <Text style={[styles.wpName, { color: theme.text }]}>{wp.name}</Text>
                    {wp.isPro && <Text style={[styles.wpPro, { color: theme.accent }]}>PRO</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>App Icon</Text>
          <Text style={[styles.sectionNote, { color: theme.textMuted }]}>
            Each icon has a light and a dark version — qw follows your device's appearance automatically.
            Every tile below is shown split: left is light mode, right is dark.
          </Text>

          <View style={[styles.card, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            {APP_ICONS.map((icon, i) => {
              const selected = icon.id === selectedId;
              const locked = icon.isPro && !hasPro;
              return (
                <Pressable
                  key={icon.id}
                  onPress={() => selectIcon(icon)}
                  style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }]}
                >
                  <AppIconTile icon={icon} size={56} />
                  <View style={styles.rowText}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.iconName, { color: theme.text }]}>{icon.name}</Text>
                      {icon.isPro && (
                        <View style={[styles.proBadge, { backgroundColor: theme.accentSoft }]}>
                          <Text style={[styles.proText, { color: theme.accent }]}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.iconSub, { color: theme.textFaint }]}>
                      {locked ? "Unlock with Pro" : "Light + dark"}
                    </Text>
                  </View>
                  {selected ? (
                    <View style={[styles.check, { backgroundColor: theme.accent }]}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  ) : locked ? (
                    <Text style={[styles.lock, { color: theme.textFaint }]}>🔒</Text>
                  ) : (
                    <View style={[styles.radio, { borderColor: theme.border }]} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.footnote, { color: theme.textFaint }]}>
            Your choice is saved now. Swapping the actual home-screen icon takes effect in the full qw app
            build (it's a native capability Expo Go can't preview).
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  done: { fontSize: 16, fontWeight: "700" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 8, marginBottom: 8 },
  sectionNote: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  wallpaperGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 4 },
  wallpaperCell: { width: "22%", minWidth: 70 },
  wallpaperSwatch: { width: "100%", aspectRatio: 0.62, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  wpCheck: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  wpCheckMark: { color: "#fff", fontSize: 12, fontWeight: "800" },
  wpLock: { fontSize: 15 },
  wpNameRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 6 },
  wpName: { fontSize: 12, fontWeight: "600" },
  wpPro: { fontSize: 8.5, fontWeight: "800", letterSpacing: 0.4 },
  card: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  rowText: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconName: { fontSize: 16, fontWeight: "600" },
  proBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  proText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  iconSub: { fontSize: 12.5, marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  checkMark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  lock: { fontSize: 16 },
  footnote: { fontSize: 12, lineHeight: 17, marginTop: 18, textAlign: "center" },
});
