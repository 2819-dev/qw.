import { View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import BrowserPreview from "../../ui/BrowserPreview";
import { activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";

export default function WelcomeStep({ prefs, theme, stepIndex, stepCount, onNext }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      eyebrow="Welcome to qw."
      title="A browser that bends to you."
      subtitle="Spaces, tab stacks, your own layout and colors. Let's set up a qw that works the way your brain does — takes about a minute."
      header={
        <View style={{ marginBottom: 4 }}>
          <BrowserPreview
            theme={theme}
            layout={prefs.layout}
            space={activeSpace(prefs)}
            spaces={prefs.spaces}
            height={210}
          />
        </View>
      }
      onContinue={onNext}
      continueLabel="Let's go"
    />
  );
}
