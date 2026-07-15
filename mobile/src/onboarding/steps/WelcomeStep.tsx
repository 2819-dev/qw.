import { View } from "react-native";
import OnboardingLayout from "../OnboardingLayout";
import PhonePreview from "../../ui/PhonePreview";
import { activeSpace } from "../../state/defaults";
import type { StepProps } from "./types";

export default function WelcomeStep({ prefs, theme, stepIndex, stepCount, onNext }: StepProps) {
  return (
    <OnboardingLayout
      theme={theme}
      stepIndex={stepIndex}
      stepCount={stepCount}
      title="A browser that bends to you."
      subtitle="Spaces, tab stacks, your layout, your colors. Let's shape a qw that works the way you do — about a minute."
      header={
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 22 }}>
          <PhonePreview
            theme={theme}
            barPosition={prefs.barPosition}
            space={activeSpace(prefs)}
            spaces={prefs.spaces}
            height={280}
          />
        </View>
      }
      onContinue={onNext}
      continueLabel="Get started"
    />
  );
}
