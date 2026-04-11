import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ForecastRow } from "@/components/ForecastRow";
import { WeatherCard } from "@/components/WeatherCard";
import { useColors } from "@/hooks/useColors";

const OWM_KEY = process.env.EXPO_PUBLIC_OWM_KEY || "";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  condition: string;
  location: string;
  pressure?: number;
  visibility?: number;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateForecast(baseTemp: number): ForecastDay[] {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear Sky"];
    return {
      day: i === 0 ? "Tomorrow" : DAYS[d.getDay()],
      high: baseTemp + Math.floor(Math.random() * 5) - 2,
      low: baseTemp - 6 + Math.floor(Math.random() * 4),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: 55 + Math.floor(Math.random() * 30),
    };
  });
}

const AGRI_TIPS: Record<string, string> = {
  rain: "Postpone pesticide spraying. Ensure proper drainage in fields.",
  sunny: "Ideal for harvesting dried crops. Monitor soil moisture levels.",
  cloud: "Good conditions for transplanting seedlings. Reduced water stress.",
  wind: "Secure greenhouse covers. Avoid foliar spraying — drift risk.",
  clear: "Perfect for land preparation and sowing activities.",
};

function getAgriTip(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return AGRI_TIPS.rain;
  if (c.includes("sun") || c.includes("hot")) return AGRI_TIPS.sunny;
  if (c.includes("wind")) return AGRI_TIPS.wind;
  if (c.includes("cloud")) return AGRI_TIPS.cloud;
  return AGRI_TIPS.clear;
}

export default function WeatherScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    setError(null);
    try {
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (OWM_KEY) {
            const [current, forecastRes] = await Promise.all([
              fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${OWM_KEY}&units=metric`).then(r => r.json()),
              fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${OWM_KEY}&units=metric&cnt=40`).then(r => r.json()),
            ]);
            const w: WeatherData = {
              temp: current.main.temp,
              feelsLike: current.main.feels_like,
              humidity: current.main.humidity,
              wind: Math.round(current.wind.speed * 3.6),
              condition: current.weather[0].description.split(" ").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" "),
              location: current.name + ", " + current.sys.country,
              pressure: current.main.pressure,
              visibility: current.visibility ? Math.round(current.visibility / 1000) : undefined,
            };
            setWeather(w);
            const dailyMap: Record<string, { temps: number[], humidity: number[], condition: string }> = {};
            forecastRes.list?.forEach((item: { dt: number; main: { temp: number; humidity: number }; weather: { description: string }[] }) => {
              const d = new Date(item.dt * 1000);
              const key = DAYS[d.getDay()];
              if (!dailyMap[key]) dailyMap[key] = { temps: [], humidity: [], condition: item.weather[0].description };
              dailyMap[key].temps.push(item.main.temp);
              dailyMap[key].humidity.push(item.main.humidity);
            });
            const fc: ForecastDay[] = Object.entries(dailyMap).slice(0, 5).map(([day, data]) => ({
              day,
              high: Math.max(...data.temps),
              low: Math.min(...data.temps),
              condition: data.condition.split(" ").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" "),
              humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
            }));
            setForecast(fc);
            return;
          }
          const geo = await Location.reverseGeocodeAsync(loc.coords);
          const city = geo[0]?.city || "Your City";
          const mockTemp = 27 + Math.floor(Math.random() * 8);
          setWeather({ temp: mockTemp, feelsLike: mockTemp + 2, humidity: 65, wind: 14, condition: "Partly Cloudy", location: city });
          setForecast(generateForecast(mockTemp));
          return;
        }
      }
      setWeather({ temp: 28, feelsLike: 30, humidity: 62, wind: 12, condition: "Sunny", location: "Demo Location" });
      setForecast(generateForecast(28));
    } catch {
      setError("Unable to fetch weather. Showing sample data.");
      setWeather({ temp: 28, feelsLike: 30, humidity: 62, wind: 12, condition: "Sunny", location: "Demo Location" });
      setForecast(generateForecast(28));
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : 8, paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Getting weather data...</Text>
        </View>
      ) : (
        <>
          {error && (
            <View style={[styles.errorBanner, { backgroundColor: "#fff8e1", borderColor: "#f57f17" }]}>
              <Feather name="alert-triangle" size={14} color="#f57f17" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {weather && (
            <WeatherCard
              temperature={weather.temp}
              feelsLike={weather.feelsLike}
              condition={weather.condition}
              humidity={weather.humidity}
              windSpeed={weather.wind}
              location={weather.location}
            />
          )}
          {weather && (
            <View style={[styles.agriTip, { backgroundColor: colors.secondary, borderColor: colors.primary + "40" }]}>
              <View style={styles.agriTipHeader}>
                <Feather name="feather" size={15} color={colors.primary} />
                <Text style={[styles.agriTipTitle, { color: colors.primary }]}>Farming Advisory</Text>
              </View>
              <Text style={[styles.agriTipText, { color: colors.foreground }]}>
                {getAgriTip(weather.condition)}
              </Text>
            </View>
          )}
          {weather && (
            <View style={styles.extraStats}>
              {weather.pressure !== undefined && (
                <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="activity" size={18} color={colors.primary} />
                  <Text style={[styles.statVal, { color: colors.foreground }]}>{weather.pressure} hPa</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Pressure</Text>
                </View>
              )}
              {weather.visibility !== undefined && (
                <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="eye" size={18} color={colors.primary} />
                  <Text style={[styles.statVal, { color: colors.foreground }]}>{weather.visibility} km</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Visibility</Text>
                </View>
              )}
            </View>
          )}
          {forecast.length > 0 && <ForecastRow forecasts={forecast} />}
          <Pressable onPress={onRefresh} style={[styles.refreshBtn, { borderColor: colors.primary }]}>
            <Feather name="refresh-cw" size={14} color={colors.primary} />
            <Text style={[styles.refreshText, { color: colors.primary }]}>Refresh Weather</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 24 },
  loadingBox: { alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 12 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: { color: "#f57f17", fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  agriTip: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  agriTipHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  agriTipTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  agriTipText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  extraStats: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statVal: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular" },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  refreshText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
