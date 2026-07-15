import type { ImageSourcePropType } from "react-native";

export interface AppIconVariant {
  id: string;
  name: string;
  isPro: boolean;
  light: ImageSourcePropType;
  dark: ImageSourcePropType;
  /** iOS alternate-icon key for a future dev build (see app.json config). */
  iosAltKey?: string;
}

/**
 * The qw. app-icon variants. Each has a light-mode and dark-mode artwork;
 * the app follows the device's system appearance to show the right one.
 * Free variants are always selectable; Pro variants require a subscription.
 */
export const APP_ICONS: AppIconVariant[] = [
  {
    id: "default",
    name: "Classic",
    isPro: false,
    light: require("../../assets/app-icons/light-default.png"),
    dark: require("../../assets/app-icons/dark-default.png"),
  },
  {
    id: "sky-blue",
    name: "Sky Blue",
    isPro: false,
    light: require("../../assets/app-icons/light-sky-blue.png"),
    dark: require("../../assets/app-icons/dark-sky-blue.png"),
  },
  {
    id: "gold",
    name: "Gold",
    isPro: false,
    light: require("../../assets/app-icons/light-gold.png"),
    dark: require("../../assets/app-icons/dark-gold.png"),
  },
  {
    id: "sunset",
    name: "Sunset",
    isPro: true,
    light: require("../../assets/app-icons/light-sunset.png"),
    dark: require("../../assets/app-icons/dark-sunset.png"),
  },
  {
    id: "gradient-blue",
    name: "Gradient Blue",
    isPro: true,
    light: require("../../assets/app-icons/light-gradient-blue.png"),
    dark: require("../../assets/app-icons/dark-gradient-blue.png"),
  },
  {
    id: "mono",
    name: "Minimal",
    isPro: true,
    light: require("../../assets/app-icons/light-mono.png"),
    dark: require("../../assets/app-icons/dark-mono.png"),
  },
];

export const DEFAULT_APP_ICON_ID = "default";

export function findAppIcon(id: string): AppIconVariant {
  return APP_ICONS.find((i) => i.id === id) ?? APP_ICONS[0];
}
