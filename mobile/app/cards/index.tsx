import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import bookData from "../../data/cards.json";
import { Book, FilterStatus, SortKey } from "../../src/lib/types";
import { filterAndSortCards } from "../../src/lib/bookStats";
import { getCardProgress } from "../../src/lib/storage";
import { useApp } from "../../src/context/AppContext";
import { ScreenBackground } from "../../src/components/ScreenBackground";
import { CardListRow } from "../../src/components/CardListRow";
import { colors } from "../../src/theme/colors";

const book = bookData as Book;

const STATUS: { id: FilterStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_progress", label: "Active" },
  { id: "complete", label: "Done" },
  { id: "not_started", label: "New" },
  { id: "favorites", label: "★" },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "default", label: "Book" },
  { id: "az", label: "A–Z" },
  { id: "goal", label: "Goal" },
  { id: "progress", label: "%" },
];

export default function CardsScreen() {
  const { progress, favorites, ready } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<SortKey>("default");
  const themes = useMemo(() => {
    const set = new Set(book.cards.map((c) => c.theme));
    return ["all", ...Array.from(set).sort()];
  }, []);
  const [theme, setTheme] = useState("all");

  const filtered = useMemo(
    () =>
      filterAndSortCards(book.cards, progress, {
        query,
        status,
        sort,
        favorites,
        theme,
      }),
    [progress, query, status, sort, favorites, theme]
  );

  if (!ready) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <ActivityIndicator color={colors.cream} />
          <Text style={styles.loading}>Loading challenges…</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Link href="/" asChild>
            <Pressable hitSlop={12} style={styles.back}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
          </Link>
          <Text style={styles.title}>All Challenges</Text>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search 99 cards…"
          placeholderTextColor={colors.taupe}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        <View style={styles.chips}>
          {STATUS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setStatus(s.id)}
              style={[styles.chip, status === s.id && styles.chipOn]}
            >
              <Text
                style={[styles.chipText, status === s.id && styles.chipTextOn]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.chips}>
          {SORTS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setSort(s.id)}
              style={[styles.chip, sort === s.id && styles.chipOn]}
            >
              <Text
                style={[styles.chipText, sort === s.id && styles.chipTextOn]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.chips}>
          {themes.slice(0, 8).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTheme(t)}
              style={[styles.chip, theme === t && styles.chipOn]}
            >
              <Text
                style={[styles.chipText, theme === t && styles.chipTextOn]}
              >
                {t === "all" ? "Theme" : t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.count}>{filtered.length} cards</Text>

        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          initialNumToRender={8}
          windowSize={7}
          maxToRenderPerBatch={8}
          removeClippedSubviews
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No matches</Text>
              <Text style={styles.emptyBody}>
                Try clearing search or filters — or star favorites from a card
                page.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CardListRow
              card={item}
              progress={getCardProgress(progress, item.id)}
              href={`/cards/${item.id}`}
              favorite={favorites.has(item.id)}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loading: { color: colors.dustyRoseBright },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: colors.cream, fontSize: 32, lineHeight: 36 },
  title: {
    flex: 1,
    color: colors.cream,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Georgia",
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "rgba(240,220,216,0.14)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.cream,
    fontSize: 15,
    minHeight: 48,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(240,220,216,0.1)",
    minHeight: 36,
    justifyContent: "center",
  },
  chipOn: { backgroundColor: colors.cream },
  chipText: { color: colors.dustyRoseBright, fontSize: 12, fontWeight: "700" },
  chipTextOn: { color: colors.burgundy },
  count: {
    color: colors.dustyRoseBright,
    fontSize: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  empty: { padding: 24, alignItems: "center" },
  emptyTitle: { color: colors.cream, fontWeight: "700", fontSize: 16 },
  emptyBody: {
    color: colors.dustyRoseBright,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
