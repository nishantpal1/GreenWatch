import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "react-native-keyboard-controller";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register, error, clearError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    clearError();
    setLoading(true);
    try {
      await register({ name, email, password, phone, location });
      router.replace("/(tabs)" as never);
    } catch {
      // error shown via context
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 20, paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.backRow}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Join GreenWatch and connect with thousands of farmers
        </Text>
      </View>

      {error && (
        <View style={[styles.errorBox, { backgroundColor: "#ffebee", borderColor: "#ef9a9a" }]}>
          <Feather name="alert-circle" size={14} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { label: "Full Name", value: name, onChange: setName, placeholder: "Arjun Singh Patel", key: "name", type: "default" as const },
          { label: "Email Address", value: email, onChange: setEmail, placeholder: "arjun@example.com", key: "email", type: "email-address" as const },
          { label: "Phone Number", value: phone, onChange: setPhone, placeholder: "+91 98765 43210", key: "phone", type: "phone-pad" as const },
          { label: "Location (Village/City, State)", value: location, onChange: setLocation, placeholder: "Amritsar, Punjab", key: "location", type: "default" as const },
          { label: "Password", value: password, onChange: setPassword, placeholder: "Minimum 8 characters", key: "password", type: "default" as const },
        ].map(field => (
          <View key={field.key}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={colors.mutedForeground}
              keyboardType={field.type}
              secureTextEntry={field.key === "password"}
              autoCapitalize={field.key === "email" || field.key === "password" ? "none" : "words"}
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
            />
          </View>
        ))}

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={({ pressed }) => [styles.registerBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Create Account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/auth/login" as never)} style={styles.loginLink}>
          <Text style={[styles.loginLinkText, { color: colors.mutedForeground }]}>
            Already have an account?{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  backRow: { marginBottom: 16 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  errorText: { color: "#d32f2f", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 4,
  },
  label: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  registerBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },
  registerBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  loginLink: { alignItems: "center", marginTop: 12 },
  loginLinkText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
