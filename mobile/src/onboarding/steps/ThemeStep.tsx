import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import PhonePreview from "../../ui/PhonePreview";
import AppIconTile from "../../icons/AppIconTile";
import { findAppIcon } from "../../icons/catalog";
import { activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";
import type { ThemeMode } from "../../state/types";

const MODES: { id: ThemeMode; title: string; desc: string }[] = [
  { id: "light", title: "Light", desc: "Bright." },
  { id: "dark", title: "Dark", desc: "Night." },
  { id: "auto", title: "Auto", desc: "System." },
];

export default function ThemeStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const space = activeSpace(prefs);
  const icon = findAppIcon(prefs.appIconId);
  const size = 58;
  const radius = size * 0.225;

  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Appearance"
      title="Light or dark?"
      subtitle="Everything — even your app icon — follows this. Auto swaps with your phone."
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
          return (
            <Pressable
              key={mode.id}
              onPress={() => updatePrefs({ themeMode: mode.id })}
              style={[
                styles.card,
                { backgroundColor: selected ? theme.accentSoft : theme.bgElevated, borderColor: selected ? theme.accent : theme.border },
              ]}
            >
              {mode.id === "auto" ? (
                <AppIconTile icon={icon} size={size} />
              ) : (
                <Image
                  source={mode.id === "light" ? icon.light : icon.dark}
                  style={{ width: size, height: size, borderRadius: radius }}
                />
              )}
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
  card: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, alignItems: "center", gap: 8 },
  title: { fontSize: 14, fontWeight: "700" },
  desc: { fontSize: 11, textAlign: "center" },
});
