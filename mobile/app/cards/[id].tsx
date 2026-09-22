import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import bookData from "../../data/cards.json";
import { Book } from "../../src/lib/types";
import { getBundle } from "../../src/lib/bundles";
import { getCardProgress } from "../../src/lib/storage";
import { formatCurrency } from "../../src/lib/format";
import { buildOverlays, sumOverlayCents } from "../../src/lib/overlays";
import { useApp } from "../../src/context/AppContext";
import { ScreenBackground } from "../../src/components/ScreenBackground";
import { GlassPanel } from "../../src/components/GlassPanel";
import { OverlayCardCanvas } from "../../src/components/OverlayCardCanvas";
import { CompletionBanner } from "../../src/components/CompletionBanner";
import { colors } from "../../src/theme/colors";

const book = bookData as Book;

export default function CardDetailScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const {
    progress,
    toggleCell,
    setOverlayAmount,
    favorites,
    toggleFavorite,
    canUndo,
    undo,
  } = useApp();

  const card = book.cards.find((c) => c.id === id);
  const bundle = from ? getBundle(from) : undefined;
  const cardProgress = card ? getCardProgress(progress, card.id) : null;

  const overlays = useMemo(() => {
    if (!card || !cardProgress) return [];
    return buildOverlays(card, cardProgress.amountOverrides);
  }, [card, cardProgress]);

  if (!card || !cardProgress) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.center}>
          <Text style={styles.err}>Card not found</Text>
          <Text style={styles.errBody}>
            That challenge is not in this book. Head back and pick another.
          </Text>
          <Link href="/cards" asChild>
            <Pressable style={styles.errBtn}>
              <Text style={styles.errBtnText}>Back to cards</Text>
            </Pressable>
          </Link>
          <Link href="/" asChild>
            <Pressable style={styles.errLink}>
              <Text style={styles.errLinkText}>Home</Text>
            </Pressable>
          </Link>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const progressPercent = (cardProgress.savedCents / card.goalCents) * 100;
  const overlaySum = sumOverlayCents(overlays);
  const flagged = card.qaFlags?.includes("cell_sum_mismatch");
  const edited =
    Boolean(cardProgress.amountOverrides) &&
    Object.keys(cardProgress.amountOverrides || {}).length > 0;
  const showMismatchNote =
    flagged || (edited && Math.abs(overlaySum - card.goalCents) > 0);
  const isFav = favorites.has(card.id);
  const backHref = bundle ? (`/bundles/${bundle.id}` as const) : ("/cards" as const);
  const backLabel = bundle ? bundle.name : "Cards";

  const onShareWin = async () => {
    const msg = `I just saved ${formatCurrency(cardProgress.savedCents)} on "${card.title}" with Keeping Tab!`;
    try {
      await Share.share({ message: msg });
    } catch {
      // ignore
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Link href={backHref} asChild>
            <Pressable style={styles.back} hitSlop={8}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
          </Link>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow} numberOfLines={1}>
              {backLabel}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {card.title}
            </Text>
          </View>
          <Pressable
            onPress={() => toggleFavorite(card.id)}
            style={styles.fav}
            accessibilityLabel={isFav ? "Remove favorite" : "Add favorite"}
          >
            <Text style={styles.favText}>{isFav ? "★" : "☆"}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <GlassPanel>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Printed goal</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(card.goalCents)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.statLabel}>Saved</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(cardProgress.savedCents)}
                </Text>
              </View>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, progressPercent)}%` as `${number}%`,
                    backgroundColor: cardProgress.isComplete
                      ? colors.sage
                      : colors.cream,
                  },
                ]}
              />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {cardProgress.filledCells.size} of {overlays.length} filled
              </Text>
              <Text style={styles.meta}>{Math.round(progressPercent)}%</Text>
            </View>

            <CompletionBanner visible={cardProgress.isComplete} />

            {showMismatchNote ? (
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  Overlay amounts sum to {formatCurrency(overlaySum)}; printed
                  goal is {formatCurrency(card.goalCents)}. Edit overlays to
                  match — printed goal stays primary.
                </Text>
              </View>
            ) : null}

            {cardProgress.isComplete ? (
              <Pressable onPress={onShareWin} style={styles.shareBtn}>
                <Text style={styles.shareText}>Share this win</Text>
              </Pressable>
            ) : null}
          </GlassPanel>

          {canUndo ? (
            <Pressable onPress={undo} style={styles.undo}>
              <Text style={styles.undoText}>Undo</Text>
            </Pressable>
          ) : null}

          <View style={{ height: 16 }} />
          <OverlayCardCanvas
            card={card}
            filledIds={cardProgress.filledCells}
            amountOverrides={cardProgress.amountOverrides}
            onToggle={(overlayId) => toggleCell(card.id, overlayId, card)}
            onAmountChange={(overlayId, cents) =>
              setOverlayAmount(card.id, overlayId, cents, card)
            }
          />
        </ScrollView>
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
    lineHeight: 20,
  },
  errBtn: {
    backgroundColor: colors.cream,
    paddingHorizontal: 20,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  errBtnText: { color: colors.burgundy, fontWeight: "800" },
  errLink: { marginTop: 14, minHeight: 44, justifyContent: "center" },
  errLinkText: { color: colors.cream, fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
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
  fav: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  favText: { color: colors.cream, fontSize: 22 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: { color: colors.dustyRoseBright, fontSize: 12 },
  statValue: { color: colors.cream, fontSize: 20, fontWeight: "800" },
  track: {
    height: 10,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  meta: { color: colors.dustyRoseBright, fontSize: 12 },
  note: {
    marginTop: 12,
    backgroundColor: "rgba(240,220,216,0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(240,220,216,0.2)",
  },
  noteText: { color: colors.dustyRoseBright, fontSize: 12, lineHeight: 18 },
  shareBtn: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  shareText: { color: colors.burgundy, fontWeight: "800" },
  undo: {
    alignSelf: "flex-end",
    marginTop: 10,
    minHeight: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  undoText: { color: colors.cream, fontWeight: "600", fontSize: 14 },
});
