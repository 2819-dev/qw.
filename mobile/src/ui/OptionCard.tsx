import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Palette } from "../theme/useTheme";

interface OptionCardProps {
  theme: Palette;
  title: string;
  desc: string;
  selected: boolean;
  onPress: () => void;
  preview?: ReactNode;
  style?: object;
}

export default function OptionCard({ theme, title, desc, selected, onPress, preview, style }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? theme.accentSoft : theme.bgElevated,
          borderColor: selected ? theme.accent : theme.border,
        },
        style,
      ]}
    >
      {preview}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.desc, { color: theme.textMuted }]}>{desc}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  title: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  desc: { fontSize: 12.5, lineHeight: 17 },
});
