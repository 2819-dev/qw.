import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { SearchBarPosition, ToolbarButtonId, TrialStatus } from "../state/types";
import type { Palette } from "../theme/useTheme";
import { TOOLBAR_BUTTONS } from "../state/defaults";

interface AddressBarProps {
  theme: Palette;
  position: SearchBarPosition;
  url: string;
  onNavigate: (url: string) => void;
  buttons: ToolbarButtonId[];
  onButtonPress: (id: ToolbarButtonId) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isBookmarked: boolean;
  trialStatus: TrialStatus;
  trialLabel: string;
  onTrialPress: () => void;
}

export default function AddressBar({
  theme,
  position,
  url,
  onNavigate,
  buttons,
  onButtonPress,
  canGoBack,
  canGoForward,
  isBookmarked,
  trialStatus,
  trialLabel,
  onTrialPress,
}: AddressBarProps) {
  const [draft, setDraft] = useState(url);
  useEffect(() => setDraft(url), [url]);

  function isDisabled(id: ToolbarButtonId): boolean {
    if (id === "back") return !canGoBack;
    if (id === "forward") return !canGoForward;
    return false;
  }

  function iconFor(id: ToolbarButtonId): string {
    if (id === "bookmark") return isBookmarked ? "★" : "☆";
    return TOOLBAR_BUTTONS.find((b) => b.id === id)?.icon ?? "";
  }

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.bgElevated, borderColor: theme.border },
        position === "top" ? styles.borderBottom : styles.borderTop,
      ]}
    >
      {buttons.map((id) => {
        const disabled = isDisabled(id);
        return (
          <Pressable key={id} onPress={() => onButtonPress(id)} disabled={disabled} hitSlop={8} style={styles.icon}>
            <Text
              style={[
                styles.iconText,
                { color: disabled ? theme.textFaint : id === "bookmark" && isBookmarked ? theme.accent : theme.text },
              ]}
            >
              {iconFor(id)}
            </Text>
          </Pressable>
        );
      })}
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={() => onNavigate(draft)}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        placeholder="Search or enter address"
        placeholderTextColor={theme.textFaint}
        style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
      />
      <Pressable
        onPress={onTrialPress}
        style={[
          styles.pill,
          {
            borderColor: trialStatus === "trialing" ? theme.accent : theme.border,
            backgroundColor: theme.bgElevated2,
          },
        ]}
      >
        <Text
          style={[styles.pillText, { color: trialStatus === "trialing" ? theme.accent : theme.textMuted }]}
          numberOfLines={1}
        >
          {trialLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 8 },
  borderBottom: { borderBottomWidth: 1 },
  borderTop: { borderTopWidth: 1 },
  icon: { width: 26, height: 28, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 16 },
  input: { flex: 1, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, fontSize: 13.5 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, maxWidth: 110 },
  pillText: { fontSize: 10.5, fontWeight: "700" },
});
