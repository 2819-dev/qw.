import { StyleSheet, Text, type TextStyle } from "react-native";

interface WordmarkProps {
  size?: number;
  color?: string;
  /** Tint just the trailing dot with the accent — a subtle brand+space tie-in. */
  dotColor?: string;
  style?: TextStyle;
}

/** The qw. wordmark — heavy weight, tight tracking, to match the app icon. */
export default function Wordmark({ size = 24, color = "#fff", dotColor, style }: WordmarkProps) {
  return (
    <Text style={[styles.mark, { fontSize: size, color, letterSpacing: -size * 0.05 }, style]}>
      qw
      <Text style={{ color: dotColor ?? color }}>.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  mark: {
    fontWeight: "800",
    includeFontPadding: false,
  },
});
