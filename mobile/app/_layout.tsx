import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider, useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";
import { enableWeeklyReminder, disableReminders } from "../src/lib/reminders";

/** Cold start / deep links always resolve into the tab shell first. */
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function HomeHeaderButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.replace("/(tabs)")}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Go home"
      style={{ paddingHorizontal: 8, minHeight: 44, justifyContent: "center" }}
    >
      <Text style={{ color: colors.cream, fontWeight: "700", fontSize: 15 }}>
        Home
      </Text>
    </Pressable>
  );
}

const stackHeader = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.burgundyDeep },
  headerTintColor: colors.cream,
  headerTitleStyle: {
    fontFamily: "Georgia",
    fontWeight: "700" as const,
    color: colors.cream,
  },
  headerShadowVisible: false,
  headerBackTitle: "Back",
  contentStyle: { backgroundColor: colors.burgundyDeep },
  headerRight: () => <HomeHeaderButton />,
};

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, onboardingDone, reminderEnabled } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const root = segments[0];
    const onOnboarding = root === "onboarding";
    // After onboarding, always land in the tab shell — not a bare "/" that
    // can miss the (tabs) group after a stale Metro reload.
    if (!onboardingDone && !onOnboarding) {
      router.replace("/onboarding");
    } else if (onboardingDone && onOnboarding) {
      router.replace("/(tabs)");
    }
  }, [ready, onboardingDone, segments, router]);

  useEffect(() => {
    if (!ready) return;
    if (reminderEnabled) void enableWeeklyReminder();
    else void disableReminders();
  }, [ready, reminderEnabled]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.burgundyDeep,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.cream} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Gate>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.burgundyDeep },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="cards/[id]"
              options={{
                ...stackHeader,
                title: "Card",
              }}
            />
            <Stack.Screen
              name="cards/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="bundles/[id]"
              options={{
                ...stackHeader,
                title: "Pack",
              }}
            />
          </Stack>
        </Gate>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
