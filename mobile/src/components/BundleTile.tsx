import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Bundle, ProgressState, Book } from "../lib/types";
import { accentSolid, colors } from "../theme/colors";
import { GlassPanel } from "./GlassPanel";
import { cardsForBundle } from "../lib/bundles";
import { bundleStats } from "../lib/bookStats";
import { formatCurrency } from "../lib/format";

type Props = {
  bundle: Bundle;
  book: Book;
  progress: ProgressState;
  locked?: boolean;
};

export function BundleTile({ bundle, book, progress, locked }: Props) {
  const cards = cardsForBundle(book, bundle);
  const stats = bundleStats(cards, progress);
  const started = stats.done + stats.started > 0;
  const solid = accentSolid[bundle.accent] || colors.taupe;

  const body = (
    <GlassPanel style={started ? styles.started : undefined}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    bundle.tier === "paid" ? colors.burgundy : colors.sage,
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {bundle.tier === "paid"
                  ? bundle.priceLabel || "Paid"
                  : "Free"}
              </Text>
            </View>
            {locked && (
              <View style={[styles.badge, styles.lockBadge]}>
                <Text style={styles.badgeText}>Locked</Text>
              </View>
            )}
            {started && !locked && (
              <View style={[styles.badge, styles.progressBadge]}>
                <Text style={styles.badgeText}>
                  {stats.done}/{bundle.cardIds.length} done
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {bundle.name}
          </Text>
          <Text style={styles.tagline} numberOfLines={2}>
            {bundle.tagline}
          </Text>
          <Text style={styles.meta}>
            {bundle.cardIds.length} cards
            {started
              ? ` · ${formatCurrency(stats.savedCents)} saved`
              : " · tap to open"}
          </Text>
          {started && (
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(
                      100,
                      (stats.done / Math.max(1, bundle.cardIds.length)) * 100
                    )}%` as `${number}%`,
                    backgroundColor:
                      stats.done === bundle.cardIds.length
                        ? colors.sage
                        : colors.cream,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <View style={[styles.icon, { backgroundColor: solid }]}>
          <Text style={styles.count}>
            {locked ? "Lock" : String(bundle.cardIds.length)}
          </Text>
        </View>
      </View>
    </GlassPanel>
  );

  return (
    <Link href={`/bundles/${bundle.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${bundle.name}, ${bundle.tier} pack`}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
      >
        {body}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  started: { borderColor: "rgba(240,220,216,0.4)" },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  copy: { flex: 1, minWidth: 0 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minHeight: 24,
    justifyContent: "center",
  },
  lockBadge: { backgroundColor: "rgba(240,220,216,0.18)" },
  progressBadge: { backgroundColor: "rgba(68,112,76,0.55)" },
  badgeText: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  tagline: {
    color: colors.dustyRoseBright,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 19,
  },
  meta: { color: colors.dustyRoseBright, fontSize: 12, marginTop: 10 },
  track: {
    marginTop: 8,
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  count: { color: colors.cream, fontWeight: "700", fontSize: 15 },
});
