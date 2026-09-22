import React, { useMemo } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import bookData from "../../data/cards.json";
import { Book } from "../../src/lib/types";
import { cardsForBundle, getBundle } from "../../src/lib/bundles";
import { bundleStats, statusLabel } from "../../src/lib/bookStats";
import { getCardProgress } from "../../src/lib/storage";
import { formatCurrency } from "../../src/lib/format";
import { useApp } from "../../src/context/AppContext";
import { ScreenBackground } from "../../src/components/ScreenBackground";
import { GlassPanel } from "../../src/components/GlassPanel";
import { CardListRow } from "../../src/components/CardListRow";
import { colors } from "../../src/theme/colors";

const book = bookData as Book;

export default function BundleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress, isBundleUnlocked, unlockBundle, favorites } = useApp();
  const bundle = getBundle(id || "");

  const cards = useMemo(
    () => (bundle ? cardsForBundle(book, bundle) : []),
    [bundle]
  );
  const stats = useMemo(() => bundleStats(cards, progress), [cards, progress]);

  if (!bundle) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.center}>
          <Text style={styles.err}>Pack not found</Text>
          <Text style={styles.errBody}>
            That pack is not available. Head home and pick another.
          </Text>
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.errBtn}>
              <Text style={styles.errBtnText}>Back home</Text>
            </Pressable>
          </Link>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const locked = !isBundleUnlocked(bundle.id, bundle.tier);

  const sections = useMemo(() => {
    const groups: Record<string, typeof cards> = {
      Complete: [],
      "In progress": [],
      "Not started": [],
    };
    for (const card of cards) {
      const p = getCardProgress(progress, card.id);
      groups[statusLabel(p)].push(card);
    }
    return (["In progress", "Not started", "Complete"] as const)
      .map((title) => ({
        title: `${title} · ${groups[title].length}`,
        data: groups[title],
      }))
      .filter((s) => s.data.length > 0);
  }, [cards, progress]);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <Stack.Screen
          options={{
            title: bundle.name,
            headerRight: () => (
              <Pressable
                onPress={() => router.replace("/(tabs)")}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go home"
                style={{ paddingHorizontal: 8, minHeight: 44, justifyContent: "center" }}
              >
                <Text style={{ color: colors.cream, fontWeight: "700", fontSize: 15 }}>
                  Home
                </Text>
              </Pressable>
            ),
          }}
        />

        <SectionList
          sections={locked ? [] : sections}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View>
              <GlassPanel>
                <Text style={styles.tagline}>{bundle.tagline}</Text>
                <Text style={styles.meta}>
                  {stats.done} of {cards.length} done ·{" "}
                  {formatCurrency(stats.savedCents)} saved in this pack
                </Text>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(
                          100,
                          (stats.done / Math.max(1, cards.length)) * 100
                        )}%` as `${number}%`,
                        backgroundColor:
                          stats.done === cards.length
                            ? colors.sage
                            : colors.cream,
                      },
                    ]}
                  />
                </View>
              </GlassPanel>

              {locked ? (
                <GlassPanel style={styles.lockCard}>
                  <Text style={styles.lockTitle}>{bundle.name}</Text>
                  <Text style={styles.lockBody}>
                    Unique set · {bundle.priceLabel || "Paid"}. Unlock this pack
                    to open every card inside.
                  </Text>
                  <Pressable
                    onPress={() => unlockBundle(bundle.id)}
                    style={styles.unlockBtn}
                  >
                    <Text style={styles.unlockText}>
                      Unlock {bundle.priceLabel || "pack"}
                    </Text>
                  </Pressable>
                </GlassPanel>
              ) : null}
            </View>
          }
          renderSectionHeader={({ section }) => (
            <Text style={styles.section}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <CardListRow
              card={item}
              progress={getCardProgress(progress, item.id)}
              href={`/cards/${item.id}?from=${bundle.id}`}
              locked={locked}
              onLockedPress={() => unlockBundle(bundle.id)}
              favorite={favorites.has(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            locked ? <View style={{ height: 12 }} /> : (
              <Text style={styles.meta}>No cards in this pack.</Text>
            )
          }
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  err: { color: colors.cream, fontSize: 18, fontWeight: "700" },
  errBody: {
    color: colors.dustyRoseBright,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  errBtn: {
    backgroundColor: colors.cream,
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  errBtnText: { color: colors.burgundy, fontWeight: "800" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: colors.cream, fontSize: 32, lineHeight: 36 },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: colors.dustyRoseBright,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  tagline: { color: colors.cream, fontSize: 15, lineHeight: 21 },
  meta: { color: colors.dustyRoseBright, fontSize: 12, marginTop: 8 },
  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  lockCard: { marginTop: 14, alignItems: "center" },
  lockTitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  lockBody: {
    color: colors.dustyRoseBright,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  unlockBtn: {
    marginTop: 14,
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockText: { color: colors.burgundy, fontWeight: "800" },
  section: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 10,
  },
});
