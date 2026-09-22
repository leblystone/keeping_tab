import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Card, CardProgress } from "../lib/types";
import { formatCurrency } from "../lib/format";
import { getCardImage } from "../lib/cardImages";
import { colors } from "../theme/colors";
import { statusLabel } from "../lib/bookStats";

type Props = {
  card: Card;
  progress: CardProgress;
  href: string;
  locked?: boolean;
  onLockedPress?: () => void;
  favorite?: boolean;
};

export function CardListRow({
  card,
  progress,
  href,
  locked,
  onLockedPress,
  favorite,
}: Props) {
  const pct =
    card.goalCents > 0 ? (progress.savedCents / card.goalCents) * 100 : 0;
  const image = getCardImage(card.id);
  const status = statusLabel(progress);

  const inner = (
    <View style={[styles.row, locked && { opacity: 0.55 }]}>
      <View style={styles.thumb}>
        {image ? (
          <Image source={image} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbImg, { backgroundColor: colors.dustyRose }]} />
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {card.title}
          </Text>
          {favorite ? <Text style={styles.star}>★</Text> : null}
          {progress.isComplete ? (
            <View style={styles.done}>
              <Text style={styles.doneText}>✓</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta}>
          Goal {formatCurrency(card.goalCents)} · {status}
        </Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(100, pct)}%` as `${number}%`,
                backgroundColor: progress.isComplete ? colors.sage : colors.cream,
              },
            ]}
          />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {formatCurrency(progress.savedCents)} saved
          </Text>
          <Text style={styles.meta}>{Math.round(pct)}%</Text>
        </View>
      </View>
    </View>
  );

  if (locked) {
    return (
      <Pressable onPress={onLockedPress} accessibilityRole="button">
        {inner}
      </Pressable>
    );
  }

  return (
    <Link href={href as `/cards/${string}`} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={card.title}>
        {inner}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
    minHeight: 96,
  },
  thumb: { width: 72, backgroundColor: colors.burgundy },
  thumbImg: { width: "100%", height: "100%", minHeight: 96 },
  body: { flex: 1, paddingVertical: 12, paddingRight: 12, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { flex: 1, color: colors.cream, fontSize: 16, fontWeight: "700" },
  star: { color: colors.cream, fontSize: 14 },
  done: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: { color: colors.cream, fontWeight: "800", fontSize: 12 },
  meta: { color: colors.dustyRoseBright, fontSize: 12, marginTop: 2 },
  track: {
    marginTop: 8,
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
