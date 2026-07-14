import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { ACCENT_COLORS } from "../state/defaults";
import type { Palette } from "../theme/useTheme";
import type { AccentColor } from "../state/types";

interface HeroIllustrationProps {
  theme: Palette;
  accentColor: AccentColor;
}

export default function HeroIllustration({ theme, accentColor }: HeroIllustrationProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[theme.accentSoft, "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.glow}
      />

      <View style={[styles.device, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={styles.deviceBar}>
          <View style={[styles.dot, { backgroundColor: theme.textFaint }]} />
          <View style={[styles.dot, { backgroundColor: theme.textFaint }]} />
          <View style={[styles.pill, { backgroundColor: theme.accentSoft }]} />
        </View>
        <View style={styles.deviceBody}>
          <LinearGradient
            colors={[accentColor.value, theme.bgElevated2]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={styles.blob}
          />
        </View>
      </View>

      <View style={styles.swatchRow}>
        {ACCENT_COLORS.map((c, i) => (
          <View
            key={c.id}
            style={[
              styles.swatch,
              {
                backgroundColor: c.value,
                borderColor: theme.bg,
                marginLeft: i === 0 ? 0 : -10,
                transform: [{ scale: c.id === accentColor.id ? 1.15 : 1 }],
                zIndex: c.id === accentColor.id ? 1 : 0,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: 8 },
  glow: {
    position: "absolute",
    top: -20,
    width: 260,
    height: 180,
    borderRadius: 130,
  },
  device: {
    width: 220,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  deviceBar: { flexDirection: "row", alignItems: "center", gap: 5, padding: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pill: { flex: 1, height: 10, borderRadius: 999, marginLeft: 4 },
  deviceBody: { height: 110 },
  blob: { flex: 1 },
  swatchRow: { flexDirection: "row", alignItems: "center" },
  swatch: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});
