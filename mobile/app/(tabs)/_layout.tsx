import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";

/**
 * Opaque tab bar — BlurView was easy to miss on burgundy and could fail to
 * paint in Expo Go after a stale route tree. Keep the shell always obvious.
 */
function TabBarBackground() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: colors.burgundyDeep,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.glassBorder,
        },
      ]}
    />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "ios" ? 12 : 8);
  const barHeight = 52 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.cream,
        tabBarInactiveTintColor: colors.dustyRoseBright,
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          backgroundColor: colors.burgundyDeep,
          borderTopColor: colors.glassBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: barHeight,
          paddingTop: 6,
          paddingBottom: bottomPad,
          elevation: 8,
          // Never collapse / float off-screen
          position: "relative",
          display: "flex",
        },
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.3,
        },
        sceneStyle: { backgroundColor: colors.burgundyDeep },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          href: "/",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          href: "/browse",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          href: "/favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          href: "/me",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
