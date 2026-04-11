import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeatherCard } from "@/components/WeatherCard";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { CROP_TIPS, MARKET_PRICES } from "@/lib/mockData";

const OWM_KEY = process.env.EXPO_PUBLIC_OWM_KEY || "";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  condition: string;
  location: string;
}

function getMockWeather(city: string): WeatherData {
  return {
    temp: 28 + Math.floor(Math.random() * 8),
    feelsLike: 30,
    humidity: 60 + Math.floor(Math.random() * 20),
    wind: 12 + Math.floor(Math.random() * 10),
    condition: ["Partly Cloudy", "Sunny", "Clear Sky", "Light Breeze"][Math.floor(Math.random() * 4)],
    location: city,
  };
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    loadWeather();
    const timer = setInterval(() => {
      setTipIndex(i => (i + 1) % CROP_TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function loadWeather() {
    setLoadingWeather(true);
    try {
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (OWM_KEY) {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${OWM_KEY}&units=metric`
            );
            const data = await res.json();
            setWeather({
              temp: data.main.temp,
              feelsLike: data.main.feels_like,
              humidity: data.main.humidity,
              wind: Math.round(data.wind.speed * 3.6),
              condition: data.weather[0].description
                .split(" ")
                .map((w: string) => w[0].toUpperCase() + w.slice(1))
                .join(" "),
              location: data.name + ", " + data.sys.country,
            });
            return;
          }
          const geo = await Location.reverseGeocodeAsync(loc.coords);
          const city = geo[0]?.city || geo[0]?.district || "Your Location";
          setWeather(getMockWeather(city));
          return;
        }
      }
      setWeather(getMockWeather(user?.location?.split(",")[0] || "Your City"));
    } catch {
      setWeather(getMockWeather("Your City"));
    } finally {
      setLoadingWeather(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  }

  const topMarkets = MARKET_PRICES.slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : 0, paddingBottom: Platform.OS === "web" ? 34 : 16 },
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good day,</Text>
          <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name || "Farmer"}</Text>
        </View>
        <Pressable onPress={() => router.push("/(tabs)/profile")} style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{(user?.name || "F")[0].toUpperCase()}</Text>
        </Pressable>
      </View>

      {loadingWeather ? (
        <View style={[styles.weatherLoading, { backgroundColor: colors.primary + "20" }]}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.primary }]}>Fetching weather...</Text>
        </View>
      ) : weather ? (
        <WeatherCard
          temperature={weather.temp}
          feelsLike={weather.feelsLike}
          condition={weather.condition}
          humidity={weather.humidity}
          windSpeed={weather.wind}
          location={weather.location}
        />
      ) : null}

      <View style={[styles.tipCard, { backgroundColor: colors.accent + "18", borderColor: colors.accent + "40" }]}>
        <View style={styles.tipHeader}>
          <Feather name="alert-circle" size={16} color={colors.accent} />
          <Text style={[styles.tipTitle, { color: colors.accent }]}>Crop Tip of the Moment</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.foreground }]}>{CROP_TIPS[tipIndex]}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          {[
            { icon: "cloud", label: "Weather", route: "/(tabs)/weather", color: "#1565c0" },
            { icon: "grid", label: "Crop Advisor", route: "/(tabs)/crops", color: "#388e3c" },
            { icon: "bar-chart-2", label: "Market Prices", route: "/(tabs)/market", color: "#f57f17" },
            { icon: "shopping-bag", label: "Marketplace", route: "/(tabs)/marketplace", color: "#7b1fa2" },
          ].map((action) => (
            <Pressable
              key={action.route}
              onPress={() => router.push(action.route as never)}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + "18" }]}>
                <Feather name={action.icon as keyof typeof Feather.glyphMap} size={22} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Market Highlights</Text>
          <Pressable onPress={() => router.push("/(tabs)/market" as never)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <View style={[styles.marketCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.th, { color: colors.foreground, flex: 1.4 }]}>Crop</Text>
            <Text style={[styles.th, { color: colors.foreground, flex: 1 }]}>₹/Quintal</Text>
            <Text style={[styles.th, { color: colors.foreground, flex: 0.8, textAlign: "right" }]}>Change</Text>
          </View>
          {topMarkets.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.tableRow,
                idx < topMarkets.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.td, { color: colors.foreground, flex: 1.4 }]}>{item.crop}</Text>
              <Text style={[styles.tdPrice, { color: colors.foreground, flex: 1 }]}>
                ₹{item.price.toLocaleString("en-IN")}
              </Text>
              <Text
                style={[
                  styles.tdChange,
                  {
                    color: item.change > 0 ? "#388e3c" : item.change < 0 ? "#d32f2f" : colors.mutedForeground,
                    flex: 0.8,
                  },
                ]}
              >
                {item.change === 0 ? "—" : `${item.change > 0 ? "+" : ""}${item.change}%`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sell Your Produce</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/marketplace" as never)}
          style={[styles.sellBanner, { backgroundColor: colors.primary }]}
        >
          <View style={styles.sellContent}>
            <Text style={styles.sellTitle}>Post Your Products</Text>
            <Text style={styles.sellSub}>Reach thousands of buyers directly — no middlemen</Text>
          </View>
          <View style={styles.sellArrow}>
            <Feather name="arrow-right" size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  userName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold" },
  weatherLoading: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  loadingText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  tipCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 6,
  },
  tipHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  tipTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tipText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBtn: {
    width: "47%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  marketCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  th: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  td: { fontSize: 13, fontFamily: "Inter_400Regular" },
  tdPrice: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tdChange: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  sellBanner: {
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  sellContent: { flex: 1 },
  sellTitle: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  sellSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular" },
  sellArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
