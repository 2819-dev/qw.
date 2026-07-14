import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import BrowserPreview from "../../ui/BrowserPreview";
import { activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";
import type { BrowserLayout } from "../../state/types";
import type { Palette } from "../../theme/useTheme";

const OPTIONS: { id: BrowserLayout; title: string; desc: string }[] = [
  { id: "sidebar", title: "Sidebar", desc: "Tabs and spaces down the side — room to breathe when you keep a lot open." },
  { id: "topbar", title: "Top bar", desc: "Tabs across the top, page fills the rest. Familiar and compact." },
];

export default function LayoutStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  const space = activeSpace(prefs);
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Layout"
      title="Sidebar or top bar?"
      subtitle="This is the frame everything else lives in. Tap one to see it — the preview is the real thing."
      onBack={onBack}
      onContinue={onNext}
    >
      <BrowserPreview theme={theme} layout={prefs.layout} space={space} spaces={prefs.spaces} height={196} />

      <View style={styles.options}>
        {OPTIONS.map((opt) => {
          const selected = prefs.layout === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => updatePrefs({ layout: opt.id })}
              style={[
                styles.card,
                {
                  backgroundColor: selected ? theme.accentSoft : theme.bgElevated,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <MiniGlyph theme={theme} layout={opt.id} accent={selected ? theme.accent : theme.textFaint} />
              <View style={styles.cardText}>
                <Text style={[styles.title, { color: theme.text }]}>{opt.title}</Text>
                <Text style={[styles.desc, { color: theme.textMuted }]}>{opt.desc}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

function MiniGlyph({ theme, layout, accent }: { theme: Palette; layout: BrowserLayout; accent: string }) {
  return (
    <View style={[glyph.frame, { borderColor: theme.border }]}>
      {layout === "sidebar" ? (
        <View style={glyph.rowFill}>
          <View style={[glyph.side, { backgroundColor: accent }]} />
          <View style={[glyph.page, { backgroundColor: theme.bgElevated2 }]} />
        </View>
      ) : (
        <View style={glyph.colFill}>
          <View style={[glyph.top, { backgroundColor: accent }]} />
          <View style={[glyph.pageFull, { backgroundColor: theme.bgElevated2 }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  options: { marginTop: 18, gap: 12 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  cardText: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  desc: { fontSize: 12.5, lineHeight: 17 },
});

const glyph = StyleSheet.create({
  frame: { width: 40, height: 34, borderRadius: 7, borderWidth: 1.5, padding: 3, overflow: "hidden" },
  rowFill: { flex: 1, flexDirection: "row", gap: 3 },
  colFill: { flex: 1, gap: 3 },
  side: { width: 10, borderRadius: 3 },
  page: { flex: 1, borderRadius: 3 },
  top: { height: 8, borderRadius: 3 },
  pageFull: { flex: 1, borderRadius: 3 },
});
