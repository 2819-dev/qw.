import { StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import PhonePreview from "../../ui/PhonePreview";
import { TOOLBAR_BUTTONS, activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";

export default function SummaryStep({ prefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const name = prefs.displayName.trim();
  const space = activeSpace(prefs);
  const toolbarLabel = prefs.toolbarButtons
    .map((id) => TOOLBAR_BUTTONS.find((b) => b.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  const rows: [string, string][] = [
    ["Search bar", prefs.barPosition === "top" ? "Top" : "Bottom"],
    ["Spaces", prefs.spaces.map((s) => `${s.emoji} ${s.name}`).join("  ")],
    ["Theme", prefs.themeMode[0].toUpperCase() + prefs.themeMode.slice(1)],
    ["Toolbar", toolbarLabel],
  ];

  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="All set"
      title={name ? `Here's your qw, ${name}.` : "Here's your qw."}
      subtitle="This is exactly what you'll drop into. Everything's editable later."
      header={
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <PhonePreview theme={theme} barPosition={prefs.barPosition} space={space} spaces={prefs.spaces} height={244} />
        </View>
      }
      onBack={onBack}
      onContinue={onNext}
      continueLabel="Finish setup"
    >
      {rows.map(([label, value]) => (
        <View key={label} style={[styles.row, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
          <Text style={[styles.value, { color: theme.text }]} numberOfLines={1}>
            {value}
          </Text>
        </View>
      ))}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right" },
});
