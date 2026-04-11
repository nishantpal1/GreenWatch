import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="weather">
        <Icon sf={{ default: "cloud.sun", selected: "cloud.sun.fill" }} />
        <Label>Weather</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="crops">
        <Icon sf={{ default: "leaf", selected: "leaf.fill" }} />
        <Label>Crops</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="market">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Market</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="marketplace">
        <Icon sf={{ default: "bag", selected: "bag.fill" }} />
        <Label>Shop</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const tabScreens = [
    { name: "index", title: "Home", sfIcon: "house", sfIconFilled: "house.fill", feather: "home" as const },
    { name: "weather", title: "Weather", sfIcon: "cloud.sun", sfIconFilled: "cloud.sun.fill", feather: "cloud" as const },
    { name: "crops", title: "Crops", sfIcon: "leaf", sfIconFilled: "leaf.fill", feather: "feather" as const },
    { name: "market", title: "Market", sfIcon: "chart.bar", sfIconFilled: "chart.bar.fill", feather: "bar-chart-2" as const },
    { name: "marketplace", title: "Shop", sfIcon: "bag", sfIconFilled: "bag.fill", feather: "shopping-bag" as const },
    { name: "profile", title: "Profile", sfIcon: "person", sfIconFilled: "person.fill", feather: "user" as const },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: "Inter_700Bold", color: colors.foreground, fontSize: 20 },
        headerShadowVisible: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ) : null,
      }}
    >
      {tabScreens.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name={tab.sfIcon} tintColor={color} size={22} />
              ) : (
                <Feather name={tab.feather} size={21} color={color} />
              ),
          }}
        />
      ))}
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
