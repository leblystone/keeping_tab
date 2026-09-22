import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider, useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";
import { enableWeeklyReminder, disableReminders } from "../src/lib/reminders";

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, onboardingDone, reminderEnabled } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const onOnboarding = segments[0] === "onboarding";
    if (!onboardingDone && !onOnboarding) {
      router.replace("/onboarding");
    } else if (onboardingDone && onOnboarding) {
      router.replace("/");
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
          />
        </Gate>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
