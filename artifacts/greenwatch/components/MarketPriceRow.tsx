import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { MarketPrice } from "@/lib/mockData";

interface Props {
  item: MarketPrice;
  isEven: boolean;
}

export function MarketPriceRow({ item, isEven }: Props) {
  const colors = useColors();
  const isUp = item.change > 0;
  const isFlat = item.change === 0;

  return (
    <View style={[
      styles.row,
      { backgroundColor: isEven ? colors.surface : colors.card },
    ]}>
      <Text style={[styles.crop, { color: colors.foreground }]} numberOfLines={1}>{item.crop}</Text>
      <Text style={[styles.market, { color: colors.mutedForeground }]} numberOfLines={1}>{item.market}</Text>
      <Text style={[styles.price, { color: colors.foreground }]}>₹{item.price.toLocaleString("en-IN")}</Text>
      <View style={[styles.changeRow, { backgroundColor: isFlat ? colors.muted : isUp ? "#e8f5e9" : "#ffebee" }]}>
        {!isFlat && (
          <Feather
            name={isUp ? "trending-up" : "trending-down"}
            size={11}
            color={isUp ? "#388e3c" : "#d32f2f"}
          />
        )}
        <Text style={[styles.change, { color: isFlat ? colors.mutedForeground : isUp ? "#388e3c" : "#d32f2f" }]}>
          {isFlat ? "—" : `${isUp ? "+" : ""}${item.change}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 8,
  },
  crop: {
    flex: 1.4,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  market: {
    flex: 1.2,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  price: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 52,
    justifyContent: "center",
  },
  change: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
