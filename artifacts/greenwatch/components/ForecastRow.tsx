import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface ForecastItem {
  day: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
}

interface Props {
  forecasts: ForecastItem[];
}

function getWeatherIcon(condition: string): keyof typeof Feather.glyphMap {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "cloud-rain";
  if (c.includes("cloud")) return "cloud";
  if (c.includes("thunder") || c.includes("storm")) return "zap";
  if (c.includes("snow")) return "cloud-snow";
  return "sun";
}

export function ForecastRow({ forecasts }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>5-Day Forecast</Text>
      {forecasts.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            idx < forecasts.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.day, { color: colors.foreground }]}>{item.day}</Text>
          <Feather name={getWeatherIcon(item.condition)} size={20} color={colors.primary} style={styles.icon} />
          <Text style={[styles.condition, { color: colors.mutedForeground }]}>{item.condition}</Text>
          <View style={styles.temps}>
            <Text style={[styles.high, { color: colors.foreground }]}>{Math.round(item.high)}°</Text>
            <Text style={[styles.low, { color: colors.mutedForeground }]}>{Math.round(item.low)}°</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  day: {
    width: 80,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  icon: {
    marginRight: 8,
  },
  condition: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  temps: {
    flexDirection: "row",
    gap: 8,
  },
  high: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  low: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
