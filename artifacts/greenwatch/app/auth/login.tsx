import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState("arjun@greenwatch.app");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    clearError();
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)" as never);
    } catch {
      // error shown via context
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.inner,
          { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 40, paddingBottom: Platform.OS === "web" ? 34 : 24 },
        ]}
      >
        <View style={styles.logoSection}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>🌿</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>GreenWatch</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Smart Farming Platform</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign in to access your farm dashboard
          </Text>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: "#ffebee", borderColor: "#ef9a9a" }]}>
              <Feather name="alert-circle" size={14} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
          />

          <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
          <View style={[styles.passBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPass}
              style={[styles.passInput, { color: colors.foreground }]}
            />
            <Pressable onPress={() => setShowPass(!showPass)}>
              <Feather name={showPass ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [styles.loginBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            onPress={() => router.push("/auth/register" as never)}
            style={[styles.registerBtn, { borderColor: colors.primary }]}
          >
            <Text style={[styles.registerBtnText, { color: colors.primary }]}>Create New Account</Text>
          </Pressable>

          <View style={[styles.demoNote, { backgroundColor: colors.secondary }]}>
            <Feather name="info" size={13} color={colors.primary} />
            <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
              Demo credentials pre-filled. Just tap Sign In.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  logoSection: { alignItems: "center", gap: 8, marginBottom: 28 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 36 },
  appName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  tagline: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 4,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 12 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: { color: "#d32f2f", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  label: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  passBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  passInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  loginBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  loginBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 8 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  registerBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  registerBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  demoNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  demoText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
});
