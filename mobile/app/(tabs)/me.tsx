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
import bookData from "../../data/cards.json";
import { Book } from "../../src/lib/types";
import { BUNDLES, bundlesByTier } from "../../src/lib/bundles";
import { bookStats, streakDays } from "../../src/lib/bookStats";
import { formatCurrency } from "../../src/lib/format";
import { useApp } from "../../src/context/AppContext";
import { ScreenBackground } from "../../src/components/ScreenBackground";
import { GlassPanel } from "../../src/components/GlassPanel";
import { colors } from "../../src/theme/colors";

const book = bookData as Book;

export default function MeScreen() {
  const {
    progress,
    reminderEnabled,
    setReminderEnabled,
    canUndo,
    undo,
    exportProgress,
    favorites,
    isBundleUnlocked,
    unlockBundle,
  } = useApp();

  const stats = useMemo(() => bookStats(book, progress), [progress]);
  const streak = useMemo(() => streakDays(progress), [progress]);
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
          <Text style={styles.title}>Me</Text>
          <Text style={styles.subtitle}>Progress, reminders, unlocks</Text>

          <GlassPanel strong style={styles.card}>
            <Text style={styles.eyebrow}>Streak</Text>
            <Text style={styles.big}>
              {streak > 0 ? `${streak}-day streak` : "No streak yet"}
            </Text>
            <Text style={styles.line}>
              {formatCurrency(stats.savedCents)} saved · {stats.completed} done
              · {favorites.size} favorites
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
          </GlassPanel>

          <GlassPanel style={styles.card}>
            <Text style={styles.section}>Settings</Text>
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
          </GlassPanel>

          <GlassPanel style={styles.card}>
            <Text style={styles.section}>Paid packs</Text>
            <Text style={styles.hint}>
              Unlock unique art sets when you&apos;re ready.
            </Text>
            {paid.map((b) => {
              const unlocked = isBundleUnlocked(b.id, b.tier);
              return (
                <View key={b.id} style={styles.packRow}>
                  <View style={styles.packCopy}>
                    <Text style={styles.packName}>{b.name}</Text>
                    <Text style={styles.packMeta}>
                      {b.priceLabel || "Paid"} · {b.cardIds.length} cards
                      {unlocked ? " · unlocked" : ""}
                    </Text>
                  </View>
                  {unlocked ? (
                    <Link href={`/bundles/${b.id}`} asChild>
                      <Pressable style={styles.packBtn}>
                        <Text style={styles.packBtnText}>Open</Text>
                      </Pressable>
                    </Link>
                  ) : (
                    <Pressable
                      onPress={() => unlockBundle(b.id)}
                      style={styles.packBtnSolid}
                    >
                      <Text style={styles.packBtnSolidText}>
                        Unlock {b.priceLabel || ""}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </GlassPanel>

          <Text style={styles.footerNote}>
            {book.cards.length} challenges · {BUNDLES.length} packs
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 8 },
  title: {
    color: colors.cream,
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  subtitle: {
    color: colors.dustyRoseBright,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  card: { marginBottom: 14 },
  eyebrow: {
    color: colors.dustyRoseBright,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  big: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
  },
  line: {
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
  section: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  hint: {
    color: colors.dustyRoseBright,
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
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
  packRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(240,220,216,0.2)",
  },
  packCopy: { flex: 1, minWidth: 0 },
  packName: { color: colors.cream, fontWeight: "700", fontSize: 14 },
  packMeta: { color: colors.dustyRoseBright, fontSize: 12, marginTop: 2 },
  packBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  packBtnText: { color: colors.cream, fontWeight: "700", fontSize: 13 },
  packBtnSolid: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  packBtnSolidText: { color: colors.burgundy, fontWeight: "800", fontSize: 12 },
  footerNote: {
    marginTop: 8,
    textAlign: "center",
    color: colors.dustyRoseBright,
    fontSize: 12,
  },
});
