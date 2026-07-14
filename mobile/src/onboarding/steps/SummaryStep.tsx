import { StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import type { StepProps } from "./types";
import { TOOLBAR_BUTTONS } from "../../state/defaults";

export default function SummaryStep({ prefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const name = prefs.displayName.trim();
  const toolbarLabel = prefs.toolbarButtons
    .map((id) => TOOLBAR_BUTTONS.find((b) => b.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  const rows: [string, string][] = [
    ["Search bar", prefs.searchBarPosition === "top" ? "Top" : "Bottom"],
    ["Toolbar buttons", toolbarLabel],
    ["Theme", prefs.themeMode[0].toUpperCase() + prefs.themeMode.slice(1)],
    ["Accent", prefs.accentColor.label],
    ["Tabs", prefs.tabLayout === "vertical" ? "Tab drawer" : "Tab strip"],
    ["Homepage", prefs.homepage],
  ];

  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="All set"
      title={name ? `Here's your qw, ${name}.` : "Here's your qw."}
      subtitle="Everything below applies the moment you continue."
      onBack={onBack}
      onContinue={onNext}
      continueLabel="Finish setup"
    >
      {rows.map(([label, value]) => (
        <View key={label} style={[styles.row, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
          <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        </View>
      ))}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
});
