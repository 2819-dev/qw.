import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import PhonePreview from "../../ui/PhonePreview";
import { activeSpace } from "../../state/defaults";
import { paletteFor } from "../../theme/useTheme";
import type { StepProps } from "./types";
import type { ThemeMode } from "../../state/types";

const MODES: { id: ThemeMode; title: string; desc: string }[] = [
  { id: "light", title: "Light", desc: "Bright, best in daylight." },
  { id: "dark", title: "Dark", desc: "Easy on the eyes at night." },
  { id: "auto", title: "Auto", desc: "Follows your phone." },
];

export default function ThemeStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const space = activeSpace(prefs);
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Appearance"
      title="Light or dark?"
      subtitle="Your space colors carry across both. Pick the base you live in most."
      header={
        <View style={{ alignItems: "center", marginBottom: 22 }}>
          <PhonePreview theme={theme} barPosition={prefs.barPosition} space={space} spaces={prefs.spaces} height={236} />
        </View>
      }
      onBack={onBack}
      onContinue={onNext}
    >
      <View style={styles.row}>
        {MODES.map((mode) => {
          const selected = prefs.themeMode === mode.id;
          // Preview each mode's true look with the active space color.
          const swatch = paletteFor(space.color, mode.id === "auto" ? "dark" : mode.id, true);
          return (
            <Pressable
              key={mode.id}
              onPress={() => updatePrefs({ themeMode: mode.id })}
              style={[
                styles.card,
                {
                  backgroundColor: selected ? theme.accentSoft : theme.bgElevated,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <View style={[styles.swatch, { backgroundColor: mode.id === "light" ? "#f4f4f8" : "#0b0b0f", borderColor: theme.border }]}>
                <View style={[styles.swatchDot, { backgroundColor: swatch.accent }]} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{mode.title}</Text>
              <Text style={[styles.desc, { color: theme.textMuted }]}>{mode.desc}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  card: { flex: 1, padding: 12, borderRadius: 14, borderWidth: 1.5, alignItems: "center" },
  swatch: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  swatchDot: { width: 14, height: 14, borderRadius: 7 },
  title: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  desc: { fontSize: 11, textAlign: "center", lineHeight: 14 },
});
