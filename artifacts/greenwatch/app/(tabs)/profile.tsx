import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { myProducts, deleteProduct } = useMarketplace();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editLocation, setEditLocation] = useState(user?.location || "");
  const [editFarmSize, setEditFarmSize] = useState(user?.farmSize || "");

  async function handleSave() {
    await updateProfile({ name: editName, phone: editPhone, location: editLocation, farmSize: editFarmSize });
    setEditing(false);
  }

  async function handleLogout() {
    if (Platform.OS === "web") {
      await logout();
      router.replace("/auth/login" as never);
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { await logout(); router.replace("/auth/login" as never); } },
    ]);
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="user" size={56} color={colors.mutedForeground} />
        <Text style={[styles.loginTitle, { color: colors.foreground }]}>Sign in to view your profile</Text>
        <Pressable onPress={() => router.push("/auth/login" as never)} style={[styles.loginBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.loginBtnText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : 16, paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
    >
      <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || "U")[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Farm Details</Text>
          <Pressable onPress={() => editing ? handleSave() : setEditing(true)}>
            <Text style={[styles.editBtn, { color: colors.primary }]}>{editing ? "Save" : "Edit"}</Text>
          </Pressable>
        </View>

        {[
          { label: "Full Name", value: editName, onChange: setEditName, icon: "user" as const },
          { label: "Phone", value: editPhone, onChange: setEditPhone, icon: "phone" as const },
          { label: "Location", value: editLocation, onChange: setEditLocation, icon: "map-pin" as const },
          { label: "Farm Size", value: editFarmSize, onChange: setEditFarmSize, icon: "map" as const },
        ].map(field => (
          <View key={field.label} style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
            <Feather name={field.icon} size={16} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
              {editing ? (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  style={[styles.fieldInput, { color: colors.foreground, borderBottomColor: colors.primary }]}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: colors.foreground }]}>
                  {field.value || "Not set"}
                </Text>
              )}
            </View>
          </View>
        ))}

        {user?.crops && user.crops.length > 0 && (
          <View style={styles.fieldRow}>
            <Feather name="feather" size={16} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Crops Grown</Text>
              <View style={styles.cropTags}>
                {user.crops.map(c => (
                  <View key={c} style={[styles.cropTag, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.cropTagText, { color: colors.primary }]}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>My Listings ({myProducts.length})</Text>
          <Pressable onPress={() => router.push("/add-product" as never)}>
            <Text style={[styles.editBtn, { color: colors.primary }]}>+ Add</Text>
          </Pressable>
        </View>
        {myProducts.length === 0 ? (
          <View style={styles.emptyListings}>
            <Feather name="package" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No listings yet</Text>
          </View>
        ) : (
          myProducts.map(p => (
            <View key={p.id} style={[styles.listingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.listingInfo}>
                <Text style={[styles.listingName, { color: colors.foreground }]}>{p.name}</Text>
                <Text style={[styles.listingDetail, { color: colors.mutedForeground }]}>
                  ₹{p.price.toLocaleString("en-IN")}/{p.unit} · {p.quantity} {p.unit}
                </Text>
                <Text style={[styles.listingDate, { color: colors.mutedForeground }]}>{p.postedDate}</Text>
              </View>
              <View style={styles.listingActions}>
                <Pressable
                  onPress={() => {
                    if (Platform.OS === "web") {
                      deleteProduct(p.id);
                    } else {
                      Alert.alert("Delete", `Remove "${p.name}"?`, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Delete", style: "destructive", onPress: () => deleteProduct(p.id) },
                      ]);
                    }
                  }}
                >
                  <Feather name="trash-2" size={18} color="#d32f2f" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <Pressable onPress={handleLogout} style={[styles.logoutBtn, { borderColor: "#d32f2f" }]}>
        <Feather name="log-out" size={16} color="#d32f2f" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loginTitle: { fontSize: 16, fontFamily: "Inter_500Medium" },
  loginBtn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: { color: "#fff", fontSize: 30, fontFamily: "Inter_700Bold" },
  userName: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  userEmail: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  editBtn: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  fieldContent: { flex: 1 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 2 },
  fieldValue: { fontSize: 14, fontFamily: "Inter_400Regular" },
  fieldInput: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  cropTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  cropTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cropTagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  emptyListings: { alignItems: "center", gap: 8, paddingVertical: 20 },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  listingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  listingInfo: { flex: 1, gap: 2 },
  listingName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  listingDetail: { fontSize: 12, fontFamily: "Inter_400Regular" },
  listingDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  listingActions: { gap: 12 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  logoutText: { color: "#d32f2f", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
