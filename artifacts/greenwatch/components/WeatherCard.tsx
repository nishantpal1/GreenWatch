import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  feelsLike: number;
}

function getWeatherIcon(condition: string): keyof typeof Feather.glyphMap {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "cloud-rain";
  if (c.includes("cloud")) return "cloud";
  if (c.includes("thunder") || c.includes("storm")) return "zap";
  if (c.includes("snow")) return "cloud-snow";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "wind";
  return "sun";
}

export function WeatherCard({ temperature, condition, humidity, windSpeed, location, feelsLike }: Props) {
  const colors = useColors();
  const icon = getWeatherIcon(condition);

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.top}>
        <View style={styles.leftSection}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.temp}>{Math.round(temperature)}°C</Text>
          <Text style={styles.condition}>{condition}</Text>
          <Text style={styles.feelsLike}>Feels like {Math.round(feelsLike)}°C</Text>
        </View>
        <Feather name={icon} size={72} color="rgba(255,255,255,0.8)" />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Feather name="droplet" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statLabel}>{humidity}%</Text>
          <Text style={styles.statCaption}>Humidity</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Feather name="wind" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statLabel}>{windSpeed} km/h</Text>
          <Text style={styles.statCaption}>Wind</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Feather name="thermometer" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statLabel}>{Math.round(feelsLike)}°C</Text>
          <Text style={styles.statCaption}>Feels Like</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#2d7a2d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
  },
  location: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  temp: {
    color: "#fff",
    fontSize: 56,
    fontFamily: "Inter_700Bold",
    lineHeight: 60,
  },
  condition: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  feelsLike: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  stat: {
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  statCaption: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
