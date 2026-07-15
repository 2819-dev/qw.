import { useRef, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import AddressBar from "./AddressBar";
import TabOverview from "./TabOverview";
import Settings from "../settings/Settings";
import SpaceEditor from "./SpaceEditor";
import NewTabPage from "./NewTabPage";
import { normalizeUrl } from "./urls";
import { activeSpace, seedTabs, SPACE_PRESETS, NEW_TAB_URL } from "../state/defaults";
import { getElapsedTrialDays, hasTrialEnded, TRIAL_LENGTH_DAYS } from "../state/trial";
import type { Space, Tab, ToolbarButtonId } from "../state/types";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);

  const tabs = tabsBySpace[space.id] ?? [];
  const activeTabId = activeTabBySpace[space.id] ?? tabs[0]?.id ?? "";
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const onNewTab = activeTab?.url === NEW_TAB_URL;

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

  function addSpace() {
    const used = new Set(prefs.spaces.map((s) => s.id));
    const preset = SPACE_PRESETS.find((p) => !used.has(p.id));
    const next: Space =
      preset ??
      {
        id: `space-${Date.now()}`,
        name: "New Space",
        emoji: "✨",
        color: "#7c6cf6",
        homepage: NEW_TAB_URL,
      };
    setTabsBySpace((prev) => ({ ...prev, [next.id]: seedTabs(next.id) }));
    setActiveTabBySpace((prev) => ({ ...prev, [next.id]: seedTabs(next.id)[0].id }));
    dispatch({ type: "UPDATE_PREFS", prefs: { spaces: [...prefs.spaces, next], activeSpaceId: next.id } });
    setEditingSpaceId(next.id);
  }

  function saveSpace(id: string, patch: Partial<Space>) {
    dispatch({
      type: "UPDATE_PREFS",
      prefs: { spaces: prefs.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)) },
    });
  }

  function deleteSpace(id: string) {
    if (prefs.spaces.length <= 1) return;
    const remaining = prefs.spaces.filter((s) => s.id !== id);
    dispatch({
      type: "UPDATE_PREFS",
      prefs: { spaces: remaining, activeSpaceId: prefs.activeSpaceId === id ? remaining[0].id : prefs.activeSpaceId },
    });
    setEditingSpaceId(null);
  }

  function switchTab(id: string) {
    setActiveTabBySpace((prev) => ({ ...prev, [space.id]: id }));
  }

  function newTab() {
    const id = `${space.id}-n${Date.now()}`;
    const tab: Tab = { id, title: "New Tab", url: NEW_TAB_URL, pinned: false };
    setTabsBySpace((prev) => ({ ...prev, [space.id]: [...(prev[space.id] ?? []), tab] }));
    setActiveTabBySpace((prev) => ({ ...prev, [space.id]: id }));
  }

  function closeTab(id: string) {
    let remaining = tabs.filter((t) => t.id !== id);
    // Never leave a space with zero tabs — open a fresh new tab, Safari-style.
    if (remaining.length === 0) {
      remaining = [{ id: `${space.id}-n${Date.now()}`, title: "New Tab", url: NEW_TAB_URL, pinned: false }];
    }
    setTabsBySpace((prev) => ({ ...prev, [space.id]: remaining }));
    if (activeTabId === id) {
      setActiveTabBySpace((prev) => ({ ...prev, [space.id]: remaining[0].id }));
    }
  }

  function navigateActive(target: string) {
    if (!activeTab) return;
    // Updating the tab's url re-renders: a real URL mounts/steers the WebView,
    // NEW_TAB_URL swaps back to the native new-tab page.
    patchTab(activeTab.id, { url: target });
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
      {activeTab && (
        <AddressBar
          theme={theme}
          url={onNewTab ? "" : activeTab.url}
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
      <View style={[styles.pageCard, { backgroundColor: theme.bg, borderColor: theme.border, shadowColor: space.color }]}>
        {activeTab &&
          (onNewTab ? (
            <NewTabPage theme={theme} wallpaperId={prefs.newTabWallpaperId} />
          ) : (
            <WebView<object>
              key={`${space.id}:${activeTab.id}`}
              ref={webviewRef}
              source={{ uri: activeTab.url }}
              style={styles.flex}
              onNavigationStateChange={handleNavigationChange}
            />
          ))}
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
        <TabOverview
          visible={tabSheetOpen}
          theme={theme}
          spaces={prefs.spaces}
          activeSpace={space}
          tabs={tabs}
          activeTabId={activeTabId}
          wallpaperId={prefs.newTabWallpaperId}
          trialing={trial.status === "trialing"}
          trialLabel={label}
          onSelectTab={switchTab}
          onCloseTab={closeTab}
          onNewTab={newTab}
          onSwitchSpace={switchSpace}
          onAddSpace={() => {
            setTabSheetOpen(false);
            addSpace();
          }}
          onEditSpace={(id) => {
            setTabSheetOpen(false);
            setEditingSpaceId(id);
          }}
          onSettings={() => {
            setTabSheetOpen(false);
            setSettingsOpen(true);
          }}
          onUpgrade={() => {
            setTabSheetOpen(false);
            dispatch({ type: "SET_PHASE", phase: "paywall" });
          }}
          onDismiss={() => setTabSheetOpen(false)}
        />
      )}

      <Settings
        visible={settingsOpen}
        onDismiss={() => setSettingsOpen(false)}
        onUpgrade={() => {
          setSettingsOpen(false);
          dispatch({ type: "SET_PHASE", phase: "paywall" });
        }}
      />

      <SpaceEditor
        theme={theme}
        space={prefs.spaces.find((s) => s.id === editingSpaceId) ?? null}
        canDelete={prefs.spaces.length > 1}
        onSave={saveSpace}
        onDelete={deleteSpace}
        onDismiss={() => setEditingSpaceId(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  chrome: { paddingHorizontal: 12, paddingVertical: 8 },

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
