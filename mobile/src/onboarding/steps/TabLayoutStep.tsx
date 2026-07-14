import { StyleSheet, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import OptionCard from "../../ui/OptionCard";
import type { StepProps } from "./types";
import type { Palette } from "../../theme/useTheme";
import type { TabLayout } from "../../state/types";

function DrawerPreview({ theme }: { theme: Palette }) {
  return (
    <View style={[preview.frame, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={[preview.drawer, { backgroundColor: theme.bgElevated2 }]}>
        <View style={[preview.drawerRow, { backgroundColor: theme.accent }]} />
        <View style={[preview.drawerRow, { backgroundColor: theme.accentSoft }]} />
        <View style={[preview.drawerRow, { backgroundColor: theme.accentSoft }]} />
      </View>
      <View style={[preview.page, { backgroundColor: theme.bgElevated }]} />
    </View>
  );
}

function StripPreview({ theme }: { theme: Palette }) {
  return (
    <View style={[preview.frame, { flexDirection: "column", backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={preview.stripRow}>
        <View style={[preview.stripTab, { backgroundColor: theme.accent }]} />
        <View style={[preview.stripTab, { backgroundColor: theme.accentSoft }]} />
        <View style={[preview.stripTab, { backgroundColor: theme.accentSoft }]} />
      </View>
      <View style={[preview.page, { flex: 1, backgroundColor: theme.bgElevated, marginLeft: 0 }]} />
    </View>
  );
}

const OPTIONS: { id: TabLayout; title: string; desc: string }[] = [
  { id: "vertical", title: "Tab drawer", desc: "A side list that slides in — built for people who keep dozens of tabs open." },
  { id: "horizontal", title: "Tab strip", desc: "A row of tabs across the top that you swipe between." },
];

export default function TabLayoutStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Tabs"
      title="How do you like your tabs?"
      subtitle="qw remembers this, so you can always change it later in settings."
      onBack={onBack}
      onContinue={onNext}
    >
      {OPTIONS.map((opt) => (
        <OptionCard
          key={opt.id}
          theme={theme}
          title={opt.title}
          desc={opt.desc}
          selected={prefs.tabLayout === opt.id}
          onPress={() => updatePrefs({ tabLayout: opt.id })}
          preview={opt.id === "vertical" ? <DrawerPreview theme={theme} /> : <StripPreview theme={theme} />}
        />
      ))}
    </OnboardingLayout>
  );
}

const preview = StyleSheet.create({
  frame: {
    flexDirection: "row",
    height: 84,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  drawer: {
    width: "30%",
    borderRadius: 8,
    padding: 6,
    justifyContent: "center",
    gap: 5,
  },
  drawerRow: { height: 8, borderRadius: 4, width: "100%" },
  page: { flex: 1, marginLeft: 6, borderRadius: 8 },
  stripRow: { flexDirection: "row", gap: 5, marginBottom: 6 },
  stripTab: { flex: 1, height: 14, borderRadius: 5 },
});
