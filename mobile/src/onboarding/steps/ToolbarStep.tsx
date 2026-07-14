import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import type { StepProps } from "./types";
import { MAX_TOOLBAR_BUTTONS, MIN_TOOLBAR_BUTTONS, TOOLBAR_BUTTONS } from "../../state/defaults";
import type { ToolbarButtonId } from "../../state/types";

export default function ToolbarStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const selected = prefs.toolbarButtons;

  function toggle(id: ToolbarButtonId) {
    const isOn = selected.includes(id);
    if (isOn) {
      if (selected.length <= MIN_TOOLBAR_BUTTONS) return;
      updatePrefs({ toolbarButtons: selected.filter((b) => b !== id) });
    } else {
      if (selected.length >= MAX_TOOLBAR_BUTTONS) return;
      updatePrefs({ toolbarButtons: [...selected, id] });
    }
  }

  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Toolbar"
      title="Pick your toolbar buttons."
      subtitle={`Choose ${MIN_TOOLBAR_BUTTONS}–${MAX_TOOLBAR_BUTTONS}. They'll show up in the order you tap them, right where you put your search bar.`}
      onBack={onBack}
      onContinue={onNext}
    >
      <View
        style={[
          styles.previewBar,
          { backgroundColor: theme.bgElevated, borderColor: theme.border },
          prefs.searchBarPosition === "bottom" && styles.previewBarReversed,
        ]}
      >
        {selected.map((id) => {
          const btn = TOOLBAR_BUTTONS.find((b) => b.id === id)!;
          return (
            <View key={id} style={[styles.previewIcon, { backgroundColor: theme.bgElevated2 }]}>
              <Text style={{ color: theme.text, fontSize: 15 }}>{btn.icon}</Text>
            </View>
          );
        })}
        <View style={[styles.previewInput, { backgroundColor: theme.bg, borderColor: theme.border }]} />
      </View>

      <View style={styles.grid}>
        {TOOLBAR_BUTTONS.map((btn) => {
          const isOn = selected.includes(btn.id);
          const disabled = isOn ? selected.length <= MIN_TOOLBAR_BUTTONS : selected.length >= MAX_TOOLBAR_BUTTONS;
          return (
            <Pressable
              key={btn.id}
              onPress={() => toggle(btn.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isOn ? theme.accentSoft : theme.bgElevated,
                  borderColor: isOn ? theme.accent : theme.border,
                  opacity: disabled && !isOn ? 0.4 : 1,
                },
              ]}
            >
              <Text style={{ fontSize: 15, color: theme.text }}>{btn.icon}</Text>
              <Text style={[styles.chipLabel, { color: theme.text }]}>{btn.label}</Text>
              {isOn && <Text style={[styles.check, { color: theme.accent }]}>✓</Text>}
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  previewBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
  },
  previewBarReversed: { flexDirection: "row" },
  previewIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  previewInput: { flex: 1, height: 26, borderRadius: 999, borderWidth: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    flexBasis: "47%",
    flexGrow: 1,
  },
  chipLabel: { fontSize: 13.5, fontWeight: "600", flex: 1 },
  check: { fontSize: 13, fontWeight: "700" },
});
