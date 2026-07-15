import { Image, StyleSheet, View } from "react-native";
import type { AppIconVariant } from "./catalog";

interface AppIconTileProps {
  icon: AppIconVariant;
  size?: number;
}

/**
 * Shows one icon "split": the left half is the light-mode artwork, the right half
 * is the dark-mode artwork — so you can see both variants at a glance.
 */
export default function AppIconTile({ icon, size = 60 }: AppIconTileProps) {
  const radius = size * 0.225; // iOS squircle-ish
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      <View style={[styles.half, { width: size / 2 }]}>
        <Image source={icon.light} style={{ width: size, height: size }} resizeMode="cover" />
      </View>
      <View style={[styles.half, styles.rightHalf, { width: size / 2 }]}>
        <Image source={icon.dark} style={{ width: size, height: size, marginLeft: -size / 2 }} resizeMode="cover" />
      </View>
      <View style={[styles.divider, { left: size / 2 - 0.5 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: "#000", position: "relative" },
  half: { position: "absolute", top: 0, bottom: 0, left: 0, overflow: "hidden" },
  rightHalf: { left: "50%" },
  divider: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(128,128,128,0.35)" },
});
