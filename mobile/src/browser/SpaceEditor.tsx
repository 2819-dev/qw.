import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Palette } from "../theme/useTheme";
import type { Space } from "../state/types";

const COLORS = ["#7c6cf6", "#3aa8ff", "#2fd6a5", "#ff6b5e", "#f5a623", "#e05299"];
const EMOJIS = ["🏡", "💼", "📚", "🎨", "🎮", "🎯", "✨", "🔥", "🌙", "🛒", "🎧", "⚡"];

interface SpaceEditorProps {
  theme: Palette;
  space: Space | null;
  canDelete: boolean;
  onSave: (id: string, patch: Partial<Space>) => void;
  onDelete: (id: string) => void;
  onDismiss: () => void;
}

export default function SpaceEditor({ theme, space, canDelete, onSave, onDelete, onDismiss }: SpaceEditorProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (space) {
      setName(space.name);
      setEmoji(space.emoji);
      setColor(space.color);
    }
  }, [space]);

  function save() {
    if (!space) return;
    onSave(space.id, { name: name.trim() || "Space", emoji, color });
    onDismiss();
  }

  return (
    <Modal visible={!!space} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss} />
      <SafeAreaView edges={["bottom"]} style={styles.anchor} pointerEvents="box-none">
        <View style={[styles.sheet, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <View style={styles.grabberRow}>
            <View style={[styles.grabber, { backgroundColor: theme.textFaint }]} />
          </View>

          <View style={styles.previewRow}>
            <View style={[styles.previewChip, { backgroundColor: color }]}>
              <Text style={{ fontSize: 20 }}>{emoji}</Text>
              <Text style={styles.previewName} numberOfLines={1}>
                {name.trim() || "Space"}
              </Text>
            </View>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Space name"
            placeholderTextColor={theme.textFaint}
            style={[styles.input, { backgroundColor: theme.bgElevated, borderColor: theme.border, color: theme.text }]}
          />

          <Text style={[styles.label, { color: theme.textMuted }]}>Icon</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                style={[
                  styles.emojiCell,
                  { backgroundColor: theme.bgElevated, borderColor: emoji === e ? theme.accent : theme.border },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{e}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.textMuted }]}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[styles.swatch, { backgroundColor: c }, color === c && { borderColor: theme.text, borderWidth: 3 }]}
              />
            ))}
          </View>

          <Pressable onPress={save} style={[styles.saveBtn, { backgroundColor: color }]}>
            <Text style={styles.saveText}>Save space</Text>
          </Pressable>

          {canDelete && space && (
            <Pressable onPress={() => onDelete(space.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete space</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  anchor: { flex: 1, justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, paddingHorizontal: 20, paddingBottom: 12 },
  grabberRow: { alignItems: "center", paddingVertical: 8 },
  grabber: { width: 38, height: 5, borderRadius: 3, opacity: 0.7 },
  previewRow: { alignItems: "center", marginBottom: 16, marginTop: 4 },
  previewChip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, maxWidth: "80%" },
  previewName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  input: { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 16, marginBottom: 18 },
  label: { fontSize: 12.5, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  emojiCell: { width: 46, height: 46, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  colorRow: { flexDirection: "row", gap: 12, marginBottom: 22 },
  swatch: { width: 40, height: 40, borderRadius: 20, borderColor: "transparent" },
  saveBtn: { height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  deleteBtn: { alignItems: "center", paddingVertical: 14, marginTop: 4 },
  deleteText: { color: "#ff5e5e", fontSize: 14.5, fontWeight: "600" },
});
