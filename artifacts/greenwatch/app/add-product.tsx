import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "react-native-keyboard-controller";
import { useColors } from "@/hooks/useColors";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/mockData";

const UNITS = ["quintal", "kg", "ton", "litre", "dozen", "piece"];
const PRODUCT_CATEGORIES = CATEGORIES.filter(c => c !== "All");

export default function AddProductScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addProduct } = useMarketplace();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [category, setCategory] = useState("Grains");
  const [location, setLocation] = useState(user?.location || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name || !price || !quantity || !location) {
      const msg = "Please fill in all required fields (Name, Price, Quantity, Location)";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Missing Fields", msg);
      }
      return;
    }
    setLoading(true);
    try {
      await addProduct({
        name,
        price: parseFloat(price),
        quantity,
        unit,
        category,
        location,
        description,
        sellerName: user?.name || "Anonymous",
        sellerPhone: user?.phone || "Not provided",
      });
      if (Platform.OS !== "web") {
        Alert.alert("Success!", "Your product has been listed.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        router.back();
      }
    } catch {
      const msg = "Failed to add product. Please try again.";
      if (Platform.OS === "web") alert(msg);
      else Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : 16, paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>List a Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.uploadPlaceholder, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Feather name="image" size={36} color={colors.mutedForeground} />
        <Text style={[styles.uploadText, { color: colors.mutedForeground }]}>Product Image</Text>
        <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>Photo upload coming soon</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Product Information</Text>

        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Product Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Premium Wheat, Organic Tomatoes"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
        />

        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {PRODUCT_CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.chip,
                {
                  backgroundColor: category === cat ? colors.primary : colors.background,
                  borderColor: category === cat ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: category === cat ? "#fff" : colors.foreground }]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe quality, grade, conditions..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={3}
          style={[styles.textarea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Pricing & Quantity</Text>

        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Price (₹) *</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Quantity *</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder="e.g., 50"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
            />
          </View>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Unit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {UNITS.map(u => (
            <Pressable
              key={u}
              onPress={() => setUnit(u)}
              style={[
                styles.chip,
                {
                  backgroundColor: unit === u ? colors.primary : colors.background,
                  borderColor: unit === u ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: unit === u ? "#fff" : colors.foreground }]}>{u}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Location</Text>
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Your Location *</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Ludhiana, Punjab"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={({ pressed }) => [
          styles.submitBtn,
          { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather name="upload" size={18} color="#fff" />
            <Text style={styles.submitText}>List Product</Text>
          </>
        )}
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  uploadPlaceholder: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 28,
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  uploadText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  uploadSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    gap: 4,
  },
  sectionLabel: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 8 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 6, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 80,
    textAlignVertical: "top",
  },
  priceRow: { flexDirection: "row", gap: 10 },
  chipRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  submitText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
