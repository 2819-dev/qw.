import { useRef, useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useAppStore } from "../state/appStore";
import { useTheme } from "../theme/useTheme";
import AddressBar from "./AddressBar";
import SpaceSwitcher from "./SpaceSwitcher";
import TabList from "./TabList";
import { normalizeUrl } from "./urls";
import { activeSpace, seedTabs } from "../state/defaults";
import { getElapsedTrialDays, hasTrialEnded, TRIAL_LENGTH_DAYS } from "../state/trial";
import type { Palette } from "../theme/useTheme";
import type { Space, Tab, ToolbarButtonId } from "../state/types";

function trialLabel(status: string, elapsed: number, ended: boolean): string {
  if (status === "subscribed") return "qw Pro";
  if (status === "trialing") return ended ? "Trial ended" : `Day ${elapsed}/${TRIAL_LENGTH_DAYS}`;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const addressBar = activeTab && (
    <AddressBar
      theme={theme}
      url={activeTab.url}
      onNavigate={(next) => navigateActive(normalizeUrl(next))}
      buttons={prefs.toolbarButtons}
      onButtonPress={onButton}
      canGoBack={nav.canGoBack}
      canGoForward={nav.canGoForward}
      isBookmarked={activeTab ? bookmarks.has(activeTab.url) : false}
      trialStatus={trial.status}
      trialLabel={label}
      onTrialPress={() => dispatch({ type: "SET_PHASE", phase: "paywall" })}
    />
  );

  const page = (
    <View style={[styles.pageCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
      {addressBar}
      <View style={styles.webWrap}>
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
      {prefs.layout === "sidebar" ? (
        <View style={styles.rowFill}>
          {sidebarOpen && (
            <View style={[styles.sidebar, { backgroundColor: theme.bg }]}>
              <View style={styles.sidebarHeader}>
                <Text style={[styles.wordmark, { color: theme.text }]}>qw.</Text>
                <Pressable onPress={() => setSidebarOpen(false)} hitSlop={8}>
                  <Text style={[styles.collapse, { color: theme.textMuted }]}>‹‹</Text>
                </Pressable>
              </View>
              <SpaceSwitcher
                theme={theme}
                spaces={prefs.spaces}
                activeId={space.id}
                orientation="horizontal"
                compact
                onSelect={switchSpace}
              />
              <View style={styles.sidebarTabs}>
                <TabList
                  theme={theme}
                  space={space}
                  tabs={tabs}
                  activeTabId={activeTabId}
                  onSelect={switchTab}
                  onClose={closeTab}
                  onNewTab={newTab}
                />
              </View>
            </View>
          )}
          {!sidebarOpen && (
            <View style={[styles.slimRail, { backgroundColor: theme.bg }]}>
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={[styles.railBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
              >
                <Text style={{ color: theme.textMuted, fontSize: 15 }}>☰</Text>
              </Pressable>
              <SpaceSwitcher
                theme={theme}
                spaces={prefs.spaces}
                activeId={space.id}
                orientation="vertical"
                onSelect={switchSpace}
              />
            </View>
          )}
          <View style={styles.pageColSidebar}>{page}</View>
        </View>
      ) : (
        <View style={styles.colFill}>
          <View style={styles.topArea}>
            <SpaceSwitcher
              theme={theme}
              spaces={prefs.spaces}
              activeId={space.id}
              orientation="horizontal"
              onSelect={switchSpace}
            />
            <TopTabStrip
              theme={theme}
              space={space}
              tabs={tabs}
              activeTabId={activeTabId}
              onSelect={switchTab}
              onClose={closeTab}
              onNewTab={newTab}
            />
          </View>
          <View style={styles.pageColTop}>{page}</View>
        </View>
      )}
    </SafeAreaView>
  );
}

function TopTabStrip({
  theme,
  space,
  tabs,
  activeTabId,
  onSelect,
  onClose,
  onNewTab,
}: {
  theme: Palette;
  space: Space;
  tabs: Tab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={topStrip.content}>
      {tabs.map((t) => {
        const active = t.id === activeTabId;
        if (t.pinned) {
          return (
            <Pressable
              key={t.id}
              onPress={() => onSelect(t.id)}
              style={[topStrip.pinned, { backgroundColor: active ? space.color : theme.bgElevated2 }]}
            >
              <Text style={[topStrip.pinnedText, { color: active ? "#fff" : theme.textMuted }]}>
                {(t.title[0] ?? "•").toUpperCase()}
              </Text>
            </Pressable>
          );
        }
        return (
          <Pressable
            key={t.id}
            onPress={() => onSelect(t.id)}
            style={[
              topStrip.chip,
              { backgroundColor: active ? space.color : theme.bgElevated, borderColor: active ? space.color : theme.border },
            ]}
          >
            <Text style={[topStrip.chipText, { color: active ? "#fff" : theme.text }]} numberOfLines={1}>
              {t.title}
            </Text>
            <Pressable onPress={() => onClose(t.id)} hitSlop={6}>
              <Text style={{ color: active ? "rgba(255,255,255,0.8)" : theme.textFaint, fontSize: 14 }}>×</Text>
            </Pressable>
          </Pressable>
        );
      })}
      <Pressable onPress={onNewTab} style={[topStrip.add, { borderColor: theme.border }]}>
        <Text style={{ color: theme.textMuted, fontSize: 15 }}>＋</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowFill: { flex: 1, flexDirection: "row" },
  colFill: { flex: 1 },

  sidebar: { width: 176, paddingHorizontal: 10, paddingTop: 6, overflow: "hidden" },
  sidebarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingHorizontal: 2 },
  wordmark: { fontSize: 17, fontWeight: "800" },
  collapse: { fontSize: 15, fontWeight: "700" },
  sidebarTabs: { flex: 1, marginTop: 8 },
  pageColSidebar: { flex: 1, paddingRight: 8, paddingLeft: 2, paddingVertical: 6 },
  slimRail: { width: 52, paddingTop: 6, paddingHorizontal: 6, alignItems: "center", gap: 12 },
  railBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  topArea: { paddingHorizontal: 12, paddingTop: 6, gap: 8 },
  pageColTop: { flex: 1, paddingHorizontal: 8, paddingBottom: 6, paddingTop: 8 },

  pageCard: { flex: 1, borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  webWrap: { flex: 1, overflow: "hidden" },
});

const topStrip = StyleSheet.create({
  content: { alignItems: "center", gap: 6, paddingVertical: 2 },
  pinned: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  pinnedText: { fontSize: 14, fontWeight: "700" },
  chip: { flexDirection: "row", alignItems: "center", gap: 8, maxWidth: 150, paddingLeft: 12, paddingRight: 10, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "500", flexShrink: 1 },
  add: { width: 34, height: 34, borderRadius: 10, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
});
