import React, { useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Card } from "../lib/types";
import { formatCurrency } from "../lib/format";
import {
  buildOverlays,
  sumOverlayCents,
  totalSavedBand,
} from "../lib/overlays";
import { getCardImage } from "../lib/cardImages";
import { colors } from "../theme/colors";

type Props = {
  card: Card;
  filledIds: Set<string>;
  amountOverrides?: Record<string, number>;
  onToggle: (overlayId: string) => void;
  onAmountChange: (overlayId: string, amountCents: number) => void;
};

const ASPECT = 522 / 794;

export function OverlayCardCanvas({
  card,
  filledIds,
  amountOverrides,
  onToggle,
  onAmountChange,
}: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const overlays = useMemo(
    () => buildOverlays(card, amountOverrides),
    [card, amountOverrides]
  );
  const image = getCardImage(card.id);
  const overlaySum = sumOverlayCents(overlays);
  const totalBand = totalSavedBand();
  const savedNow = overlays
    .filter((o) => filledIds.has(o.id))
    .reduce((s, o) => s + o.amountCents, 0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setSize({ w: width, h: width / ASPECT });
  };

  const openEditor = (id: string, cents: number) => {
    setEditingId(id);
    setDraft(String(cents / 100));
  };

  const commitEditor = () => {
    if (!editingId) return;
    const dollars = parseFloat(draft.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(dollars)) {
      onAmountChange(editingId, Math.round(dollars * 100));
    }
    setEditingId(null);
  };

  const minSide =
    size.w > 0
      ? Math.min(
          ...overlays.map((o) =>
            Math.min((o.wPct / 100) * size.w, (o.hPct / 100) * size.h)
          )
        )
      : 44;
  const needExpand = minSide < 44;

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Text style={styles.sumLabel}>
          Overlay sum:{" "}
          <Text style={styles.sumValue}>{formatCurrency(overlaySum)}</Text>
        </Text>
        <Text style={styles.hint}>Tap to fill · pencil to edit amount</Text>
      </View>

      <View style={styles.canvas} onLayout={onLayout}>
        {size.w > 0 ? (
          <View style={{ width: size.w, height: size.h }}>
            {image ? (
              <Image
                source={image}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
                <Text style={styles.phTitle}>savings</Text>
                <Text style={styles.phSub}>challenge</Text>
              </View>
            )}

            <View
              pointerEvents="none"
              style={[
                styles.totalBand,
                {
                  left: `${totalBand.xPct}%`,
                  top: `${totalBand.yPct}%`,
                  width: `${totalBand.wPct}%`,
                  height: `${totalBand.hPct}%`,
                },
              ]}
            >
              <Text style={styles.totalLabel}>TOTAL SAVED</Text>
              <Text style={styles.totalValue}>{formatCurrency(savedNow)}</Text>
            </View>

            {overlays.map((overlay) => {
              const filled = filledIds.has(overlay.id);
              const boxH = (overlay.hPct / 100) * size.h;
              const fontSize = Math.max(10, Math.min(14, boxH * 0.32));

              return (
                <View
                  key={overlay.id}
                  style={{
                    position: "absolute",
                    left: `${overlay.xPct}%`,
                    top: `${overlay.yPct}%`,
                    width: `${overlay.wPct}%`,
                    height: `${overlay.hPct}%`,
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${formatCurrency(overlay.amountCents)}${
                      filled ? ", filled" : ", empty"
                    }`}
                    accessibilityState={{ selected: filled }}
                    hitSlop={needExpand ? 8 : 4}
                    onPress={() => onToggle(overlay.id)}
                    style={({ pressed }) => [
                      styles.box,
                      filled ? styles.boxFilled : styles.boxEmpty,
                      pressed && { transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    {filled ? <Text style={styles.check}>✓</Text> : null}
                    <Text
                      style={[
                        styles.amount,
                        {
                          fontSize,
                          color: filled ? colors.cream : colors.burgundy,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {formatCurrency(overlay.amountCents)}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Edit amount ${formatCurrency(
                      overlay.amountCents
                    )}`}
                    hitSlop={6}
                    onPress={() => openEditor(overlay.id, overlay.amountCents)}
                    style={styles.pencil}
                  >
                    <Text style={styles.pencilText}>✎</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ height: 200 }} />
        )}
      </View>

      <Text style={styles.footerHint}>
        Tap a box to fill · use ✎ to change the amount
      </Text>

      <Modal visible={!!editingId} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit amount</Text>
            <TextInput
              autoFocus
              value={draft}
              onChangeText={setDraft}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.taupe}
            />
            <View style={styles.modalRow}>
              <Pressable
                onPress={() => setEditingId(null)}
                style={[styles.modalBtn, styles.modalCancel]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={commitEditor}
                style={[styles.modalBtn, styles.modalSave]}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  toolbar: { gap: 4 },
  sumLabel: { color: colors.dustyRoseBright, fontSize: 12 },
  sumValue: { color: colors.cream, fontWeight: "700" },
  hint: { color: colors.dustyRoseBright, fontSize: 11 },
  canvas: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
    alignItems: "center",
  },
  placeholder: {
    backgroundColor: colors.nude,
    alignItems: "center",
    justifyContent: "center",
  },
  phTitle: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontStyle: "italic",
    color: "rgba(72,20,28,0.7)",
  },
  phSub: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.taupe,
    marginTop: 4,
  },
  totalBand: {
    position: "absolute",
    backgroundColor: "rgba(72,20,28,0.88)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(240,220,216,0.35)",
  },
  totalLabel: {
    color: colors.dustyRoseBright,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  totalValue: { color: colors.cream, fontSize: 14, fontWeight: "800" },
  box: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  boxFilled: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundy,
  },
  boxEmpty: {
    backgroundColor: "rgba(240,220,216,0.96)",
    borderColor: "rgba(240,220,216,0.55)",
  },
  check: {
    position: "absolute",
    top: 2,
    right: 3,
    color: colors.cream,
    fontSize: 10,
    fontWeight: "800",
  },
  amount: { fontWeight: "800" },
  pencil: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.taupe,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  pencilText: { color: colors.cream, fontSize: 11 },
  footerHint: {
    textAlign: "center",
    color: colors.dustyRoseBright,
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.burgundy,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalTitle: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.cream,
    color: colors.burgundy,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  modalRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  modalBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: { backgroundColor: "rgba(240,220,216,0.15)" },
  modalSave: { backgroundColor: colors.cream },
  modalCancelText: { color: colors.cream, fontWeight: "600" },
  modalSaveText: { color: colors.burgundy, fontWeight: "700" },
});
