import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import type { Palette } from "../theme/useTheme";
import Wordmark from "../ui/Wordmark";

interface OnboardingLayoutProps {
  theme: Palette;
  stepIndex: number;
  stepCount: number;
  eyebrow?: string;
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
        {/* header: back · wordmark · segmented progress */}
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
              <Text style={[styles.backChevron, { color: theme.text }]}>‹</Text>
            </Pressable>
          ) : (
            <Wordmark size={20} color={theme.text} dotColor={theme.accent} />
          )}
          <View style={styles.progress}>
            {Array.from({ length: stepCount }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.seg,
                  {
                    backgroundColor: i <= stepIndex ? theme.accent : theme.border,
                    width: i === stepIndex ? 20 : 7,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {header}
          {eyebrow ? <Text style={[styles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text> : null}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text> : null}
          {children}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={onContinue}
            disabled={continueDisabled}
            style={[styles.cta, { backgroundColor: theme.accent, opacity: continueDisabled ? 0.35 : 1 }]}
          >
            <Text style={styles.ctaText}>{continueLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 6,
    minHeight: 40,
  },
  backBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center", marginLeft: -6 },
  backChevron: { fontSize: 30, fontWeight: "400", lineHeight: 30 },
  progress: { flexDirection: "row", alignItems: "center", gap: 5 },
  seg: { height: 4, borderRadius: 2 },

  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "800", letterSpacing: -0.6, lineHeight: 35, marginBottom: 10 },
  subtitle: { fontSize: 15.5, lineHeight: 22, marginBottom: 26 },

  footer: { paddingHorizontal: 24, paddingBottom: 10, paddingTop: 6 },
  cta: { height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16.5, letterSpacing: 0.2 },
});
