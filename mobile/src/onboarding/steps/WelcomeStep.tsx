import OnboardingLayout from "../OnboardingLayout";
import HeroIllustration from "../HeroIllustration";
import type { StepProps } from "./types";

export default function WelcomeStep({ prefs, theme, stepIndex, stepCount, onNext }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Welcome to qw."
      title="Let's make this browser yours."
      subtitle="A couple of quick choices and qw will feel like it was built around the way you actually browse — not the other way around. Takes about a minute."
      header={<HeroIllustration theme={theme} accentColor={prefs.accentColor} />}
      onContinue={onNext}
      continueLabel="Let's go"
    />
  );
}
