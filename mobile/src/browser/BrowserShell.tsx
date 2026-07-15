import { useRef, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import AddressBar from "./AddressBar";
import SpaceSwitcher from "./SpaceSwitcher";
import TabSheet from "./TabSheet";
import { normalizeUrl } from "./urls";
import { activeSpace, seedTabs } from "../state/defaults";
import { getElapsedTrialDays, hasTrialEnded, TRIAL_LENGTH_DAYS } from "../state/trial";
import type { Tab, ToolbarButtonId } from "../state/types";

function trialLabel(status: string, elapsed: number, ended: boolean): string {
  if (status === "subscribed") return "qw Pro";
  if (status === "trialing") return ended ? "Trial ended" : `${TRIAL_LENGTH_DAYS - elapsed}d left`;
  return "Upgrade";
}

export default function BrowserShell() {
  const { state, dispatch } = useAppStore();
  const { prefs, trial } = state;
  const theme = useTheme(prefs);
  const space = activeSpace(prefs);

  const webviewRef = useRef<WebView<object>>(null);
  const [tabsBySpace, setTabsBySpace] = useState<Record<string, Tab[]>>(() => {
    const m: Record<string, Tab[]> = {};
    for (const s of prefs.spaces) m[s.id] = seedTabs(s.id);
    return m;
  });
  const [activeTabBySpace, setActiveTabBySpace] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const s of prefs.spaces) m[s.id] = seedTabs(s.id)[0].id;
    return m;
  });
  const [nav, setNav] = useState({ canGoBack: false, canGoForward: false });
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [tabSheetOpen, setTabSheetOpen] = useState(false);

  const tabs = tabsBySpace[space.id] ?? [];
  const activeTabId = activeTabBySpace[space.id] ?? tabs[0]?.id ?? "";
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const elapsed = getElapsedTrialDays(trial);
  const label = trialLabel(trial.status, elapsed, hasTrialEnded(trial));

  function patchTab(tabId: string, patch: Partial<Tab>) {
    setTabsBySpace((prev) => ({
      ...prev,
      [space.id]: (prev[space.id] ?? []).map((t) => (t.id === tabId ? { ...t, ...patch } : t)),
    }));
  }

  function switchSpace(id: string) {
    dispatch({ type: "UPDATE_PREFS", prefs: { activeSpaceId: id } });
  }

  function switchTab(id: string) {
    setActiveTabBySpace((prev) => ({ ...prev, [space.id]: id }));
  }

  function newTab() {
    const id = `${space.id}-n${Date.now()}`;
    const tab: Tab = { id, title: "New Tab", url: space.homepage, pinned: false };
    setTabsBySpace((prev) => ({ ...prev, [space.id]: [...(prev[space.id] ?? []), tab] }));
    setActiveTabBySpace((prev) => ({ ...prev, [space.id]: id }));
  }

  function closeTab(id: string) {
    const remaining = tabs.filter((t) => t.id !== id);
    if (remaining.length === 0) return;
    setTabsBySpace((prev) => ({ ...prev, [space.id]: remaining }));
    if (activeTabId === id) {
      setActiveTabBySpace((prev) => ({ ...prev, [space.id]: remaining[0].id }));
    }
  }

  function navigateActive(target: string) {
    if (!activeTab) return;
    patchTab(activeTab.id, { url: target });
    webviewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(target)}; true;`);
  }

  function handleNavigationChange(navState: WebViewNavigation) {
    setNav({ canGoBack: navState.canGoBack, canGoForward: navState.canGoForward });
    if (activeTab) {
      patchTab(activeTab.id, {
        url: navState.url,
        title: navState.title || activeTab.title,
      });
    }
  }

  function onButton(id: ToolbarButtonId) {
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
        navigateActive(space.homepage);
        break;
      case "share":
        if (activeTab) Share.share({ url: activeTab.url, message: activeTab.url }).catch(() => {});
        break;
      case "bookmark":
        if (!activeTab) break;
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (next.has(activeTab.url)) next.delete(activeTab.url);
          else next.add(activeTab.url);
          return next;
        });
        break;
    }
  }

  const chrome = (
    <View style={styles.chrome}>
      <View style={styles.spacesRow}>
        <View style={styles.spacesScroller}>
          <SpaceSwitcher
            theme={theme}
            spaces={prefs.spaces}
            activeId={space.id}
            orientation="horizontal"
            onSelect={switchSpace}
          />
        </View>
        <Pressable
          onPress={() => dispatch({ type: "SET_PHASE", phase: "paywall" })}
          style={[
            styles.trialPill,
            { borderColor: trial.status === "trialing" ? theme.accent : theme.border, backgroundColor: theme.bgElevated },
          ]}
        >
          <Text
            style={[styles.trialText, { color: trial.status === "trialing" ? theme.accent : theme.textMuted }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </Pressable>
      </View>
      {activeTab && (
        <AddressBar
          theme={theme}
          url={activeTab.url}
          onNavigate={(next) => navigateActive(normalizeUrl(next))}
          buttons={prefs.toolbarButtons}
          onButtonPress={onButton}
          canGoBack={nav.canGoBack}
          canGoForward={nav.canGoForward}
          isBookmarked={activeTab ? bookmarks.has(activeTab.url) : false}
          tabCount={tabs.length}
          onTabsPress={() => setTabSheetOpen(true)}
        />
      )}
    </View>
  );

  const page = (
    <View style={styles.pageWrap}>
      <View style={[styles.pageCard, { backgroundColor: theme.bgElevated, borderColor: theme.border, shadowColor: space.color }]}>
        {activeTab && (
          <WebView<object>
            key={`${space.id}:${activeTab.id}`}
            ref={webviewRef}
            source={{ uri: activeTab.url }}
            style={styles.flex}
            onNavigationStateChange={handleNavigationChange}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={["top", "bottom"]}>
      {prefs.barPosition === "top" ? (
        <>
          {chrome}
          {page}
        </>
      ) : (
        <>
          {page}
          {chrome}
        </>
      )}

      {activeTab && (
        <TabSheet
          visible={tabSheetOpen}
          theme={theme}
          space={space}
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={switchTab}
          onClose={closeTab}
          onNewTab={newTab}
          onDismiss={() => setTabSheetOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  chrome: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  spacesRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  spacesScroller: { flex: 1, minWidth: 0 },
  trialPill: { flexShrink: 0, borderWidth: 1, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  trialText: { fontSize: 11.5, fontWeight: "700" },

  pageWrap: { flex: 1, paddingHorizontal: 8, paddingVertical: 6 },
  pageCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
