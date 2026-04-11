import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MarketPriceRow } from "@/components/MarketPriceRow";
import { useColors } from "@/hooks/useColors";
import { MARKET_PRICES, MarketPrice } from "@/lib/mockData";

const SORT_OPTIONS = ["Default", "Price: High", "Price: Low", "Biggest Gainer", "Biggest Loser"];

export default function MarketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Default");
  const [showSort, setShowSort] = useState(false);

  const filteredAndSorted: MarketPrice[] = MARKET_PRICES.filter(m =>
    m.crop.toLowerCase().includes(search.toLowerCase()) ||
    m.market.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case "Price: High": return b.price - a.price;
      case "Price: Low": return a.price - b.price;
      case "Biggest Gainer": return b.change - a.change;
      case "Biggest Loser": return a.change - b.change;
      default: return 0;
    }
  });

  const topGainer = [...MARKET_PRICES].sort((a, b) => b.change - a.change)[0];
  const topLoser = [...MARKET_PRICES].sort((a, b) => a.change - b.change)[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topSection,
          { paddingTop: Platform.OS === "web" ? insets.top + 67 : 16 },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Market Prices</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Live mandi rates — updated daily
        </Text>

        <View style={styles.highlightRow}>
          <View style={[styles.highlight, { backgroundColor: "#e8f5e9", borderColor: "#a5d6a7" }]}>
            <View style={styles.highlightTop}>
              <Feather name="trending-up" size={14} color="#388e3c" />
              <Text style={[styles.highlightLabel, { color: "#388e3c" }]}>Top Gainer</Text>
            </View>
            <Text style={[styles.highlightCrop, { color: colors.foreground }]}>{topGainer.crop}</Text>
            <Text style={[styles.highlightChange, { color: "#388e3c" }]}>+{topGainer.change}%</Text>
          </View>
          <View style={[styles.highlight, { backgroundColor: "#ffebee", borderColor: "#ef9a9a" }]}>
            <View style={styles.highlightTop}>
              <Feather name="trending-down" size={14} color="#d32f2f" />
              <Text style={[styles.highlightLabel, { color: "#d32f2f" }]}>Top Loser</Text>
            </View>
            <Text style={[styles.highlightCrop, { color: colors.foreground }]}>{topLoser.crop}</Text>
            <Text style={[styles.highlightChange, { color: "#d32f2f" }]}>{topLoser.change}%</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search crops or market..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Feather name="x" size={15} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setShowSort(!showSort)}
            style={[styles.sortBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="sliders" size={16} color={colors.foreground} />
          </Pressable>
        </View>

        {showSort && (
          <View style={[styles.sortDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {SORT_OPTIONS.map(opt => (
              <Pressable
                key={opt}
                onPress={() => { setSortBy(opt); setShowSort(false); }}
                style={[styles.sortOption, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.sortOptionText, { color: sortBy === opt ? colors.primary : colors.foreground }]}>
                  {opt}
                </Text>
                {sortBy === opt && <Feather name="check" size={14} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.tableHeader, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.th, { flex: 1.4, color: colors.foreground }]}>Crop</Text>
        <Text style={[styles.th, { flex: 1.2, color: colors.foreground }]}>Market</Text>
        <Text style={[styles.th, { flex: 1, color: colors.foreground, textAlign: "right" }]}>₹/Quintal</Text>
        <Text style={[styles.th, { flex: 0.85, color: colors.foreground, textAlign: "center" }]}>Change</Text>
      </View>

      <FlatList
        data={filteredAndSorted}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <MarketPriceRow item={item} isEven={index % 2 === 0} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="bar-chart-2" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No results found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { paddingHorizontal: 16, paddingBottom: 10 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 14 },
  highlightRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  highlight: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
  highlightTop: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  highlightLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  highlightCrop: { fontSize: 15, fontFamily: "Inter_700Bold" },
  highlightChange: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sortDropdown: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sortOptionText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  th: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  emptyState: { alignItems: "center", gap: 10, paddingTop: 60 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
