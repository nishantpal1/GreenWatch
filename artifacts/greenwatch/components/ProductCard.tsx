import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Product } from "@/lib/mockData";

interface Props {
  product: Product;
  onPress: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Grains: "#f57f17",
  Vegetables: "#388e3c",
  Fruits: "#e91e63",
  Oilseeds: "#7b1fa2",
  "Cash Crops": "#1565c0",
  Pulses: "#d84315",
  Spices: "#ef6c00",
};

export function ProductCard({ product, onPress }: Props) {
  const colors = useColors();
  const categoryColor = CATEGORY_COLORS[product.category] || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.92 : 1 },
      ]}
    >
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.productImage} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
          <Feather name="package" size={32} color={colors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20" }]}>
            <Text style={[styles.category, { color: categoryColor }]}>{product.category}</Text>
          </View>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>{product.postedDate}</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{product.name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ₹{product.price.toLocaleString("en-IN")} / {product.unit}
        </Text>
        <Text style={[styles.qty, { color: colors.mutedForeground }]}>
          Qty: {product.quantity} {product.unit}
        </Text>
        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
              {product.location}
            </Text>
          </View>
          <View style={styles.sellerRow}>
            <Feather name="user" size={11} color={colors.mutedForeground} />
            <Text style={[styles.seller, { color: colors.mutedForeground }]} numberOfLines={1}>
              {product.sellerName}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: 110,
    height: "100%",
  },
  imagePlaceholder: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  category: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  date: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  qty: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    marginTop: 4,
    gap: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  seller: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
