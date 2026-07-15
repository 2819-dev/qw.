import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Palette } from "../theme/useTheme";

interface AddressBarProps {
  theme: Palette;
  url: string;
  onNavigate: (url: string) => void;
}

/** Safari-style top search field: search icon on the left, mic (dictation) on the right. */
export default function AddressBar({ theme, url, onNavigate }: AddressBarProps) {
  const [draft, setDraft] = useState(url);
  const inputRef = useRef<TextInput>(null);
  useEffect(() => setDraft(url), [url]);

  return (
    <View style={styles.wrap}>
      <View style={[styles.field, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <Text style={[styles.searchGlyph, { color: theme.textMuted }]}>⌕</Text>
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => onNavigate(draft)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          placeholder="Search or enter website"
          placeholderTextColor={theme.textFaint}
          style={[styles.input, { color: theme.text }]}
        />
        <Pressable onPress={() => inputRef.current?.focus()} hitSlop={8} style={styles.micBtn}>
          <Text style={[styles.mic, { color: theme.textMuted }]}>🎤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 12, paddingVertical: 6 },
  field: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, height: 44 },
  searchGlyph: { fontSize: 20, marginRight: 8, fontWeight: "700" },
  input: { flex: 1, fontSize: 15.5 },
  micBtn: { paddingLeft: 8 },
  mic: { fontSize: 15 },
});
