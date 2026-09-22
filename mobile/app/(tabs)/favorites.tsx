import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import bookData from "../../data/cards.json";
import { Book } from "../../src/lib/types";
import { getCardProgress } from "../../src/lib/storage";
import { useApp } from "../../src/context/AppContext";
import { ScreenBackground } from "../../src/components/ScreenBackground";
import { GlassPanel } from "../../src/components/GlassPanel";
import { CardListRow } from "../../src/components/CardListRow";
import { colors } from "../../src/theme/colors";

const book = bookData as Book;

export default function FavoritesScreen() {
  const { progress, favorites } = useApp();

  const cards = useMemo(
    () => book.cards.filter((c) => favorites.has(c.id)),
    [favorites]
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {cards.length === 0
              ? "Star cards you want handy"
              : `${cards.length} starred`}
          </Text>
        </View>

        <FlatList
          data={cards}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <GlassPanel style={styles.empty}>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyBody}>
                Open any card and tap ★ to pin it here — always one tab away.
              </Text>
              <Link href="/browse" asChild>
                <Pressable style={styles.cta}>
                  <Text style={styles.ctaText}>Browse cards</Text>
                </Pressable>
              </Link>
            </GlassPanel>
          }
          renderItem={({ item }) => (
            <CardListRow
              card={item}
              progress={getCardProgress(progress, item.id)}
              href={`/cards/${item.id}`}
              favorite
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
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
  },
  list: { paddingHorizontal: 16, paddingBottom: 28, flexGrow: 1 },
  empty: { marginTop: 8 },
  emptyTitle: { color: colors.cream, fontWeight: "700", fontSize: 16 },
  emptyBody: {
    color: colors.dustyRoseBright,
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },
  cta: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: colors.burgundy, fontWeight: "800" },
});
