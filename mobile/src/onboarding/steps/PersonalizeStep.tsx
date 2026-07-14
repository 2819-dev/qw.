import { StyleSheet, TextInput } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import type { StepProps } from "./types";

export default function PersonalizeStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Personalize"
      title="What should qw call you?"
      subtitle="Optional, but it makes the little moments feel like yours."
      onBack={onBack}
      onContinue={onNext}
    >
      <TextInput
        style={[styles.input, { backgroundColor: theme.bgElevated, borderColor: theme.border, color: theme.text }]}
        placeholder="Your name"
        placeholderTextColor={theme.textFaint}
        value={prefs.displayName}
        onChangeText={(v) => updatePrefs({ displayName: v })}
        autoFocus
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});
