import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import PhonePreview from "../../ui/PhonePreview";
import { activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";
import type { BarPosition } from "../../state/types";
import type { Palette } from "../../theme/useTheme";

const OPTIONS: { id: BarPosition; title: string; desc: string }[] = [
  { id: "top", title: "Top", desc: "Address bar sits up top — always in view." },
  { id: "bottom", title: "Bottom", desc: "Down by your thumb — reach it one-handed." },
];

export default function BarPositionStep({ prefs, updatePrefs, theme, stepIndex, stepCount, onNext, onBack }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Search bar"
      title="Where do you want to type?"
      subtitle="The one thing you touch most. The preview updates live — pick what feels right for your hand."
      header={
        <View style={{ alignItems: "center", marginBottom: 22 }}>
          <PhonePreview
            theme={theme}
            barPosition={prefs.barPosition}
            space={activeSpace(prefs)}
            spaces={prefs.spaces}
            height={252}
          />
        </View>
      }
      onBack={onBack}
      onContinue={onNext}
    >
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const selected = prefs.barPosition === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => updatePrefs({ barPosition: opt.id })}
              style={[
                styles.card,
                { backgroundColor: selected ? theme.accentSoft : theme.bgElevated, borderColor: selected ? theme.accent : theme.border },
              ]}
            >
              <PosGlyph theme={theme} pos={opt.id} accent={selected ? theme.accent : theme.textFaint} />
              <View style={styles.cardText}>
                <Text style={[styles.title, { color: theme.text }]}>{opt.title}</Text>
                <Text style={[styles.desc, { color: theme.textMuted }]}>{opt.desc}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? theme.accent : theme.border }]}>
                {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

function PosGlyph({ theme, pos, accent }: { theme: Palette; pos: BarPosition; accent: string }) {
  return (
    <View style={[glyph.frame, { borderColor: theme.border }]}>
      {pos === "top" && <View style={[glyph.bar, { backgroundColor: accent }]} />}
      <View style={glyph.page} />
      {pos === "bottom" && <View style={[glyph.bar, { backgroundColor: accent }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1.5 },
  cardText: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  desc: { fontSize: 13, lineHeight: 17 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 11, height: 11, borderRadius: 6 },
});

const glyph = StyleSheet.create({
  frame: { width: 30, height: 42, borderRadius: 8, borderWidth: 1.5, padding: 3, gap: 3 },
  bar: { height: 7, borderRadius: 3 },
  page: { flex: 1, borderRadius: 4, backgroundColor: "rgba(128,128,128,0.15)" },
});
