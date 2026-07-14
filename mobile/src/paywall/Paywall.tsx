import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import { activeSpace } from "../state/defaults";
import BrowserPreview from "../ui/BrowserPreview";
import TrialTimeline from "./TrialTimeline";

const FEATURES = [
  "Unlimited spaces & colors",
  "Tab stacks that stay organized",
  "Sidebar or top bar, your call",
  "Sync every space across devices",
];

type Plan = "monthly" | "yearly";

export default function Paywall() {
  const { state, dispatch } = useAppStore();
  const theme = useTheme(state.prefs);
  const [plan, setPlan] = useState<Plan>("yearly");
  const name = state.prefs.displayName.trim();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.previewWrap}>
          <BrowserPreview
            theme={theme}
            layout={state.prefs.layout}
            space={activeSpace(state.prefs)}
            spaces={state.prefs.spaces}
            height={150}
          />
        </View>

        <Text style={[styles.eyebrow, { color: theme.accent }]}>Your qw is ready</Text>
        <Text style={[styles.title, { color: theme.text }]}>{name ? `Nicely done, ${name}.` : "Nicely done."}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          You've built your spaces exactly how you want them. Keep every Pro customization with a 7-day free
          trial — no charge today.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f} style={[styles.feature, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
              <Text style={{ color: theme.accent, fontWeight: "700" }}>✓ </Text>
              <Text style={[styles.featureText, { color: theme.text }]}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.planToggle, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Pressable
            style={[styles.planOption, plan === "monthly" && { backgroundColor: theme.accent }]}
            onPress={() => setPlan("monthly")}
          >
            <Text style={[styles.planText, { color: plan === "monthly" ? "#fff" : theme.textMuted }]}>
              Monthly — $6.99
            </Text>
          </Pressable>
          <Pressable
            style={[styles.planOption, plan === "yearly" && { backgroundColor: theme.accent }]}
            onPress={() => setPlan("yearly")}
          >
            <Text style={[styles.planText, { color: plan === "yearly" ? "#fff" : theme.textMuted }]}>
              Yearly — $3.99/mo
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 43%</Text>
            </View>
          </Pressable>
        </View>

        <TrialTimeline theme={theme} elapsedDays={-1} />

        <Pressable style={[styles.cta, { backgroundColor: theme.accent }]} onPress={() => dispatch({ type: "START_TRIAL" })}>
          <Text style={styles.ctaText}>Start my 7-day free trial</Text>
        </Pressable>

        <Text style={[styles.fineprint, { color: theme.textFaint }]}>
          Nothing is charged today. We'll email you on day 5 before your trial ends, and your{" "}
          {plan === "yearly" ? "$3.99/mo (billed yearly)" : "$6.99/mo"} plan starts on day 7. Cancel anytime
          before then in Settings → Subscription.
        </Text>

        <Pressable onPress={() => dispatch({ type: "CONTINUE_FREE" })} style={styles.secondary}>
          <Text style={[styles.secondaryText, { color: theme.textMuted }]}>Continue with qw Free instead</Text>
        </Pressable>

        {__DEV__ && (
          <Pressable onPress={() => dispatch({ type: "RESTART_ONBOARDING" })} style={styles.devBtn}>
            <Text style={{ color: theme.textFaint, fontSize: 11 }}>Dev: restart onboarding</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  previewWrap: { marginBottom: 20 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 6,
  },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14.5, lineHeight: 20, textAlign: "center", marginBottom: 24 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 22 },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    flexBasis: "47%",
    flexGrow: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  featureText: { fontSize: 12.5, flexShrink: 1 },
  planToggle: { flexDirection: "row", borderRadius: 999, borderWidth: 1, padding: 4, marginBottom: 20 },
  planOption: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center" },
  planText: { fontSize: 13, fontWeight: "700" },
  saveBadge: {
    position: "absolute",
    top: -8,
    right: 6,
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  saveBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  cta: { paddingVertical: 16, borderRadius: 999, alignItems: "center", marginTop: 20, marginBottom: 12 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  fineprint: { fontSize: 11.5, lineHeight: 16, textAlign: "center", marginBottom: 18 },
  secondary: { alignItems: "center" },
  secondaryText: { fontSize: 13.5, textDecorationLine: "underline" },
  devBtn: { alignItems: "center", marginTop: 28, paddingTop: 14, borderTopWidth: 1, borderColor: "#8884" },
});
