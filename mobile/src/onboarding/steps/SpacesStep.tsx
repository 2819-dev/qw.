import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import BrowserPreview from "../../ui/BrowserPreview";
import { SPACE_PRESETS, activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";
import type { Space } from "../../state/types";

const MAX_SPACES = 4;

export default function SpacesStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const selectedIds = new Set(prefs.spaces.map((s) => s.id));

  function toggle(preset: Space) {
    const isOn = selectedIds.has(preset.id);
    if (isOn) {
      if (prefs.spaces.length <= 1) return; // keep at least one
      const remaining = prefs.spaces.filter((s) => s.id !== preset.id);
      updatePrefs({
        spaces: remaining,
        activeSpaceId: prefs.activeSpaceId === preset.id ? remaining[0].id : prefs.activeSpaceId,
      });
    } else {
      if (prefs.spaces.length >= MAX_SPACES) return;
      updatePrefs({ spaces: [...prefs.spaces, preset], activeSpaceId: preset.id });
    }
  }

  function setActive(id: string) {
    updatePrefs({ activeSpaceId: id });
  }

  const space = activeSpace(prefs);

  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Spaces"
      title="Set up your spaces."
      subtitle="A space is its own world — own tabs, own color. Keep Work and Personal apart. Tap a space to preview its look; the whole browser recolors to match."
      onBack={onBack}
      onContinue={onNext}
    >
      <BrowserPreview theme={theme} layout={prefs.layout} space={space} spaces={prefs.spaces} height={188} />

      <Text style={[styles.hint, { color: theme.textFaint }]}>
        {prefs.spaces.length} of {MAX_SPACES} spaces · tap to add, hold-free tap a selected one to preview it
      </Text>

      <View style={styles.grid}>
        {SPACE_PRESETS.map((preset) => {
          const on = selectedIds.has(preset.id);
          const isActive = prefs.activeSpaceId === preset.id;
          return (
            <Pressable
              key={preset.id}
              onPress={() => (on ? setActive(preset.id) : toggle(preset))}
              onLongPress={() => toggle(preset)}
              style={[
                styles.chip,
                {
                  backgroundColor: on ? preset.color : theme.bgElevated,
                  borderColor: on ? preset.color : theme.border,
                },
              ]}
            >
              <Text style={styles.emoji}>{preset.emoji}</Text>
              <Text style={[styles.name, { color: on ? "#fff" : theme.text }]}>{preset.name}</Text>
              {on && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{isActive ? "●" : "✓"}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.footnote, { color: theme.textFaint }]}>
        Long-press a space to remove it. You can rename, recolor, and add more anytime.
      </Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 11.5, marginTop: 14, marginBottom: 10, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    flexBasis: "47%",
    flexGrow: 1,
  },
  emoji: { fontSize: 16 },
  name: { fontSize: 13.5, fontWeight: "600", flex: 1 },
  badge: { width: 16, alignItems: "center" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  footnote: { fontSize: 11, marginTop: 14, lineHeight: 15, textAlign: "center" },
});
