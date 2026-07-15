import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { ToolbarButtonId } from "../state/types";
import type { Palette } from "../theme/useTheme";
import { TOOLBAR_BUTTONS } from "../state/defaults";

interface AddressBarProps {
  theme: Palette;
  url: string;
  onNavigate: (url: string) => void;
  buttons: ToolbarButtonId[];
  onButtonPress: (id: ToolbarButtonId) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isBookmarked: boolean;
  tabCount: number;
  onTabsPress: () => void;
}

export default function AddressBar({
  theme,
  url,
  onNavigate,
  buttons,
  onButtonPress,
  canGoBack,
  canGoForward,
  isBookmarked,
  tabCount,
  onTabsPress,
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
    <View style={styles.bar}>
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
        placeholder="Search or type a URL"
        placeholderTextColor={theme.textFaint}
        style={[styles.input, { backgroundColor: theme.bgElevated, color: theme.text, borderColor: theme.border }]}
      />
      <Pressable
        onPress={onTabsPress}
        hitSlop={6}
        style={[styles.tabsBtn, { borderColor: theme.text }]}
      >
        <Text style={[styles.tabsCount, { color: theme.text }]}>{tabCount}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 4 },
  icon: { width: 26, height: 34, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 18 },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14.5,
    marginHorizontal: 4,
  },
  tabsBtn: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  tabsCount: { fontSize: 11, fontWeight: "800" },
});
