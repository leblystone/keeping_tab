import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import bookData from "../data/cards.json";
import { Book } from "../src/lib/types";
import { BUNDLES, bundlesByTier } from "../src/lib/bundles";
import { bookStats, idleNudge, streakDays } from "../src/lib/bookStats";
import { formatCurrency } from "../src/lib/format";
import { useApp } from "../src/context/AppContext";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { GlassPanel } from "../src/components/GlassPanel";
import { BundleTile } from "../src/components/BundleTile";
import { colors } from "../src/theme/colors";

const book = bookData as Book;

export default function HomeScreen() {
  const {
    progress,
    isBundleUnlocked,
    reminderEnabled,
    setReminderEnabled,
    canUndo,
    undo,
    exportProgress,
    favorites,
  } = useApp();

  const stats = useMemo(() => bookStats(book, progress), [progress]);
  const streak = useMemo(() => streakDays(progress), [progress]);
  const nudge = useMemo(() => idleNudge(progress, book), [progress]);
  const free = bundlesByTier("free");
  const paid = bundlesByTier("paid");

  const onShareProgress = async () => {
    const msg = `Keeping Tab — ${formatCurrency(stats.savedCents)} saved · ${stats.completed} of ${stats.totalCards} challenges done`;
    try {
      await Share.share({
        message: `${msg}\n\n${exportProgress()}`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>KEEPING TAB</Text>
          <Text style={styles.hero}>{book.title}</Text>
          <Text style={styles.tag}>
            Open a pack, pick a card, tap live $ overlays — same book, now
            trackable.
          </Text>

          <GlassPanel strong style={styles.progressCard}>
            <Text style={styles.progressEyebrow}>Your book</Text>
            <Text style={styles.progressBig}>
              {formatCurrency(stats.savedCents)} saved
            </Text>
            <Text style={styles.progressLine}>
              {stats.completed} of {stats.totalCards} challenges done ·{" "}
              {stats.started} in progress
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, stats.pctFilled)}%` as `${number}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.metaText}>
                {streak > 0 ? `${streak}-day streak` : "Start a streak today"}
              </Text>
              <Text style={styles.metaText}>{favorites.size} favorites</Text>
            </View>
          </GlassPanel>

          {nudge ? (
            <Link href={`/cards/${nudge.cardId}`} asChild>
              <Pressable>
                <GlassPanel style={styles.nudge}>
                  <Text style={styles.nudgeTitle}>Come back</Text>
                  <Text style={styles.nudgeBody}>
                    You haven&apos;t touched {nudge.title} in {nudge.days} days.
                  </Text>
                </GlassPanel>
              </Pressable>
            </Link>
          ) : null}

          {stats.completed === 0 && stats.started === 0 ? (
            <GlassPanel style={styles.empty}>
              <Text style={styles.emptyTitle}>Fresh book</Text>
              <Text style={styles.emptyBody}>
                Pick a free pack below — Starter Saves is a gentle first page.
              </Text>
            </GlassPanel>
          ) : null}

          <View style={styles.sectionHead}>
            <Text style={styles.section}>Free packs</Text>
            <Text style={styles.sectionMeta}>{free.length} packs</Text>
          </View>
          <View style={styles.list}>
            {free.map((b) => (
              <BundleTile
                key={b.id}
                bundle={b}
                book={book}
                progress={progress}
              />
            ))}
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.section}>Paid packs</Text>
            <Text style={styles.sectionMeta}>{paid.length} unique sets</Text>
          </View>
          <Text style={styles.paidBlurb}>
            Paid packs are the more unique art sets. Unlock each pack when
            you&apos;re ready — prices shown on the tile.
          </Text>
          <View style={styles.list}>
            {paid.map((b) => (
              <BundleTile
                key={b.id}
                bundle={b}
                book={book}
                progress={progress}
                locked={!isBundleUnlocked(b.id, b.tier)}
              />
            ))}
          </View>

          <GlassPanel style={styles.tools}>
            <Text style={styles.toolsTitle}>Book tools</Text>
            <View style={styles.toolRow}>
              <Text style={styles.toolLabel}>Weekly reminder</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: colors.brown, true: colors.sage }}
                thumbColor={colors.cream}
              />
            </View>
            <Pressable
              onPress={onShareProgress}
              style={styles.toolBtn}
              accessibilityRole="button"
            >
              <Text style={styles.toolBtnText}>Share / export progress</Text>
            </Pressable>
            {canUndo ? (
              <Pressable onPress={undo} style={styles.toolBtn}>
                <Text style={styles.toolBtnText}>Undo last change</Text>
              </Pressable>
            ) : null}
            <Link href="/cards" asChild>
              <Pressable style={styles.toolBtn}>
                <Text style={styles.toolBtnText}>
                  Browse all {book.cards.length} cards →
                </Text>
              </Pressable>
            </Link>
            <Text style={styles.footerNote}>
              {book.cards.length} challenges · {BUNDLES.length} packs
            </Text>
          </GlassPanel>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 },
  brand: {
    textAlign: "center",
    color: colors.dustyRoseBright,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 10,
  },
  hero: {
    textAlign: "center",
    color: colors.cream,
    fontSize: 30,
    fontWeight: "700",
    fontFamily: "Georgia",
    lineHeight: 36,
  },
  tag: {
    textAlign: "center",
    color: colors.dustyRoseBright,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  progressCard: { marginBottom: 12 },
  progressEyebrow: {
    color: colors.dustyRoseBright,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  progressBig: {
    color: colors.cream,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  progressLine: {
    color: colors.dustyRoseBright,
    fontSize: 13,
    marginTop: 6,
  },
  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.cream, borderRadius: 99 },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  metaText: { color: colors.dustyRoseBright, fontSize: 12 },
  nudge: { marginBottom: 12 },
  nudgeTitle: { color: colors.cream, fontWeight: "700", fontSize: 15 },
  nudgeBody: { color: colors.dustyRoseBright, marginTop: 4, fontSize: 13 },
  empty: { marginBottom: 12 },
  emptyTitle: { color: colors.cream, fontWeight: "700", fontSize: 15 },
  emptyBody: { color: colors.dustyRoseBright, marginTop: 4, fontSize: 13 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  section: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionMeta: { color: colors.dustyRoseBright, fontSize: 12 },
  paidBlurb: {
    color: colors.dustyRoseBright,
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  list: { gap: 12 },
  tools: { marginTop: 22 },
  toolsTitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  toolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    marginBottom: 8,
  },
  toolLabel: { color: colors.dustyRoseBright, fontSize: 14 },
  toolBtn: {
    minHeight: 44,
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(240,220,216,0.2)",
    paddingVertical: 10,
  },
  toolBtnText: { color: colors.cream, fontWeight: "600", fontSize: 14 },
  footerNote: {
    marginTop: 8,
    textAlign: "center",
    color: colors.dustyRoseBright,
    fontSize: 12,
  },
});
