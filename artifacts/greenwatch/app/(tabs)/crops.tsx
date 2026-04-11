import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CropCard } from "@/components/CropCard";
import { useColors } from "@/hooks/useColors";
import { getRecommendations, SEASONS, SOIL_TYPES, CropRecommendation } from "@/lib/cropData";

export default function CropsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedSoil, setSelectedSoil] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleRecommend() {
    if (!selectedSoil || !selectedSeason) return;
    setLoading(true);
    setSearched(false);
    await new Promise(r => setTimeout(r, 600));
    const recs = getRecommendations(selectedSoil, selectedSeason);
    setRecommendations(recs);
    setLoading(false);
    setSearched(true);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : 16, paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
    >
      <View style={styles.heroBox}>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>Crop Advisor</Text>
        <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
          Get personalized crop recommendations based on your soil type and season
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.foreground }]}>Select Soil Type</Text>
        <View style={styles.chipRow}>
          {SOIL_TYPES.map(soil => (
            <Pressable
              key={soil}
              onPress={() => setSelectedSoil(soil)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedSoil === soil ? colors.primary : colors.secondary,
                  borderColor: selectedSoil === soil ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: selectedSoil === soil ? "#fff" : colors.foreground }]}>
                {soil}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.foreground, marginTop: 16 }]}>Select Season</Text>
        <View style={styles.chipRow}>
          {SEASONS.map(season => (
            <Pressable
              key={season}
              onPress={() => setSelectedSeason(season)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedSeason === season ? colors.primary : colors.secondary,
                  borderColor: selectedSeason === season ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: selectedSeason === season ? "#fff" : colors.foreground }]}>
                {season}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleRecommend}
          disabled={!selectedSoil || !selectedSeason || loading}
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: selectedSoil && selectedSeason ? colors.primary : colors.muted,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="search" size={16} color="#fff" />
              <Text style={styles.btnText}>Get Recommendations</Text>
            </>
          )}
        </Pressable>
      </View>

      {searched && recommendations.length > 0 && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
              {recommendations.length} Crop{recommendations.length > 1 ? "s" : ""} Recommended
            </Text>
          </View>
          <Text style={[styles.resultsSub, { color: colors.mutedForeground }]}>
            For {selectedSoil} soil in {selectedSeason}
          </Text>
          {recommendations.map((crop, idx) => (
            <CropCard key={idx} crop={crop} />
          ))}
        </View>
      )}

      {!searched && (
        <View style={[styles.emptyBox, { backgroundColor: colors.secondary }]}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Crop Intelligence</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Select your soil type and current season to get tailored crop recommendations for your farm.
          </Text>
        </View>
      )}

      <View style={[styles.infoCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
        <Feather name="info" size={16} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.infoTitle, { color: colors.primary }]}>About This Tool</Text>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Recommendations are based on agro-climatic data and crop suitability research. Always consult your local Krishi Vigyan Kendra for field-specific advice.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  heroBox: { marginBottom: 20 },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 6 },
  heroSub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  btn: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  resultsSection: { marginBottom: 20 },
  resultsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  resultsTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  resultsSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 14 },
  emptyBox: {
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  infoTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
