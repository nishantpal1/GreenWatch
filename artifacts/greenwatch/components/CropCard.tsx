import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { CropRecommendation } from "@/lib/cropData";

interface Props {
  crop: CropRecommendation;
}

const SUITABILITY_CONFIG = {
  high: { color: "#388e3c", bg: "#e8f5e9", label: "Highly Suitable" },
  medium: { color: "#f57f17", bg: "#fff8e1", label: "Moderately Suitable" },
  low: { color: "#d32f2f", bg: "#ffebee", label: "Low Suitability" },
};

export function CropCard({ crop }: Props) {
  const colors = useColors();
  const suitConfig = SUITABILITY_CONFIG[crop.suitability];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{crop.icon}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.foreground }]}>{crop.name}</Text>
          <View style={[styles.badge, { backgroundColor: suitConfig.bg }]}>
            <Text style={[styles.badgeText, { color: suitConfig.color }]}>{suitConfig.label}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Feather name="droplet" size={14} color={colors.primary} />
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Water</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{crop.waterNeeds}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Feather name="calendar" size={14} color={colors.primary} />
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Season</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{crop.season}</Text>
        </View>
      </View>
      <View style={[styles.tipsBox, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={13} color={colors.primary} style={{ marginTop: 1 }} />
        <Text style={[styles.tip, { color: colors.foreground }]}>{crop.tips}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  tipsBox: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  tip: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
