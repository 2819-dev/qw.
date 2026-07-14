import { useRef, useState } from "react";
import { Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import AddressBar from "./AddressBar";
import { normalizeUrl } from "./urls";
import { getElapsedTrialDays, hasTrialEnded, TRIAL_LENGTH_DAYS } from "../state/trial";
import type { ToolbarButtonId } from "../state/types";

function trialLabel(status: string, elapsed: number, ended: boolean): string {
  if (status === "subscribed") return "qw Pro";
  if (status === "trialing") return ended ? "Trial ended" : `Day ${elapsed} of ${TRIAL_LENGTH_DAYS}`;
  return "Free — Upgrade";
}

export default function BrowserShell() {
  const { state, dispatch } = useAppStore();
  const { prefs, trial } = state;
  const theme = useTheme(prefs);
  const webviewRef = useRef<WebView<object>>(null);
  const [url, setUrl] = useState(prefs.homepage);
  const [nav, setNav] = useState({ canGoBack: false, canGoForward: false });
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const elapsed = getElapsedTrialDays(trial);
  const ended = hasTrialEnded(trial);
  const label = trialLabel(trial.status, elapsed, ended);

  function handleNavigationChange(navState: WebViewNavigation) {
    setUrl(navState.url);
    setNav({ canGoBack: navState.canGoBack, canGoForward: navState.canGoForward });
  }

  function navigateTo(target: string) {
    setUrl(target);
    webviewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(target)}; true;`);
  }

  function handleButtonPress(id: ToolbarButtonId) {
    switch (id) {
      case "back":
        webviewRef.current?.goBack();
        break;
      case "forward":
        webviewRef.current?.goForward();
        break;
      case "reload":
        webviewRef.current?.reload();
        break;
      case "home":
        navigateTo(prefs.homepage);
        break;
      case "share":
        Share.share({ url, message: url }).catch(() => {});
        break;
      case "bookmark":
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (next.has(url)) next.delete(url);
          else next.add(url);
          return next;
        });
        break;
    }
  }

  const addressBar = (
    <AddressBar
      theme={theme}
      position={prefs.searchBarPosition}
      url={url}
      onNavigate={(next) => navigateTo(normalizeUrl(next))}
      buttons={prefs.toolbarButtons}
      onButtonPress={handleButtonPress}
      canGoBack={nav.canGoBack}
      canGoForward={nav.canGoForward}
      isBookmarked={bookmarks.has(url)}
      trialStatus={trial.status}
      trialLabel={label}
      onTrialPress={() => dispatch({ type: "SET_PHASE", phase: "paywall" })}
    />
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
      {prefs.tabLayout === "horizontal" && (
        <View style={[styles.tabStrip, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={[styles.tabChip, { borderColor: theme.accent }]}>
            <View style={[styles.tabDot, { backgroundColor: theme.accent }]} />
            <Text style={[styles.tabText, { color: theme.text }]} numberOfLines={1}>
              New Tab
            </Text>
          </View>
        </View>
      )}

      {prefs.searchBarPosition === "top" && addressBar}

      <WebView<object>
        ref={webviewRef}
        source={{ uri: prefs.homepage }}
        style={styles.flex}
        onNavigationStateChange={handleNavigationChange}
      />

      {prefs.searchBarPosition === "bottom" && addressBar}

      {prefs.tabLayout === "vertical" && (
        <View style={[styles.railHint, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Text style={[styles.railHintText, { color: theme.textMuted }]}>1 tab · swipe from edge for drawer</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabStrip: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1 },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: 140,
  },
  tabDot: { width: 6, height: 6, borderRadius: 3 },
  tabText: { fontSize: 12 },
  railHint: { paddingVertical: 4, alignItems: "center", borderTopWidth: 1 },
  railHintText: { fontSize: 10 },
});
