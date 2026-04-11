import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function ProductDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useMarketplace();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Product not found</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtnLarge, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  function callSeller() {
    const url = `tel:${product!.sellerPhone.replace(/\s/g, "")}`;
    if (Platform.OS !== "web") {
      Linking.openURL(url);
    } else {
      alert(`Seller Phone: ${product!.sellerPhone}`);
    }
  }

  function messageSeller() {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Contact Seller",
        `Send a WhatsApp message to ${product!.sellerName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "WhatsApp",
            onPress: () => {
              const phone = product!.sellerPhone.replace(/[^0-9]/g, "");
              const msg = encodeURIComponent(`Hi ${product!.sellerName}, I'm interested in your ${product!.name} listed on GreenWatch.`);
              Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`);
            },
          },
        ]
      );
    } else {
      alert(`Contact ${product!.sellerName} at ${product!.sellerPhone}`);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
            <Feather name="package" size={64} color={colors.primary} />
          </View>
        )}

        <View
          style={[
            styles.backOverlay,
            { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 10 },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={[styles.backCircle, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={[styles.catBadge, { backgroundColor: colors.primary + "18" }]}>
              <Text style={[styles.catText, { color: colors.primary }]}>{product.category}</Text>
            </View>
            <Text style={[styles.date, { color: colors.mutedForeground }]}>Posted {product.postedDate}</Text>
          </View>

          <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ₹{product.price.toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.perUnit, { color: colors.mutedForeground }]}>per {product.unit}</Text>
          </View>

          <View style={[styles.statsRow, { backgroundColor: colors.secondary }]}>
            <View style={styles.stat}>
              <Feather name="box" size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{product.quantity}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{product.unit}</Text>
            </View>
            <View style={[styles.vertDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Feather name="map-pin" size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]} numberOfLines={1}>{product.location.split(",")[0]}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Location</Text>
            </View>
            <View style={[styles.vertDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Feather name="tag" size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{product.category}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Category</Text>
            </View>
          </View>

          {product.description ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About this product</Text>
              <Text style={[styles.description, { color: colors.mutedForeground }]}>{product.description}</Text>
            </View>
          ) : null}

          <View style={[styles.sellerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Seller Information</Text>
            <View style={styles.sellerRow}>
              <View style={[styles.sellerAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.sellerAvatarText}>{product.sellerName[0].toUpperCase()}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.foreground }]}>{product.sellerName}</Text>
                <View style={styles.locationRow}>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.sellerLocation, { color: colors.mutedForeground }]}>{product.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <Pressable
          onPress={messageSeller}
          style={[styles.msgBtn, { borderColor: colors.primary }]}
        >
          <Feather name="message-circle" size={18} color={colors.primary} />
          <Text style={[styles.msgBtnText, { color: colors.primary }]}>Message</Text>
        </Pressable>
        <Pressable onPress={callSeller} style={[styles.callBtn, { backgroundColor: colors.primary }]}>
          <Feather name="phone" size={18} color="#fff" />
          <Text style={styles.callBtnText}>Call Seller</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_500Medium" },
  backBtnLarge: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  image: { width: "100%", height: 260 },
  imagePlaceholder: { width: "100%", height: 260, alignItems: "center", justifyContent: "center" },
  backOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 16,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 16, gap: 4 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  date: { fontSize: 12, fontFamily: "Inter_400Regular" },
  productName: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 14 },
  price: { fontSize: 28, fontFamily: "Inter_700Bold" },
  perUnit: { fontSize: 14, fontFamily: "Inter_400Regular" },
  statsRow: {
    flexDirection: "row",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  vertDivider: { width: 1, marginVertical: 4 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 8 },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  sellerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  sellerLocation: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  msgBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
  },
  msgBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  callBtn: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  callBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
