import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import type { Palette } from "../theme/useTheme";

interface OnboardingLayoutProps {
  theme: Palette;
  stepIndex: number;
  stepCount: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  header?: ReactNode;
  children?: ReactNode;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export default function OnboardingLayout({
  theme,
  stepIndex,
  stepCount,
  eyebrow,
  title,
  subtitle,
  header,
  children,
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.progressRow}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === stepIndex ? theme.accent : i < stepIndex ? theme.accentSoft : theme.border,
                },
              ]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {header}
          <Text style={[styles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text> : null}

          {children}
        </ScrollView>

        <View style={styles.nav}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={10}>
              <Text style={[styles.back, { color: theme.textMuted }]}>Back</Text>
            </Pressable>
          ) : (
            <View />
          )}
          <Pressable
            onPress={onContinue}
            disabled={continueDisabled}
            style={[
              styles.continueBtn,
              { backgroundColor: theme.accent, opacity: continueDisabled ? 0.4 : 1 },
            ]}
          >
            <Text style={styles.continueText}>{continueLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    paddingBottom: 4,
  },
  dot: { width: 26, height: 4, borderRadius: 2 },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 28 },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 8, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, lineHeight: 21, marginBottom: 24 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  back: { fontSize: 15, paddingVertical: 8 },
  continueBtn: {
    marginLeft: "auto",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 15.5 },
});
