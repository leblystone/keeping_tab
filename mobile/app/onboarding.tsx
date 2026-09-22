import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { GlassPanel } from "../src/components/GlassPanel";
import { useApp } from "../src/context/AppContext";
import { colors } from "../src/theme/colors";

const STEPS = [
  {
    title: "Open a pack",
    body: "Free packs get you started. Paid packs unlock the more unique art sets.",
  },
  {
    title: "Fill like an envelope",
    body: "Tap each $ box when you set cash aside. Watch TOTAL SAVED update live on the card.",
  },
  {
    title: "Track the whole book",
    body: "Home shows your book progress — dollars saved and challenges done across all 99 cards.",
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const router = useRouter();

  const finish = () => {
    completeOnboarding();
    // Explicit tab shell — don't rely on Gate alone after AsyncStorage write.
    router.replace("/(tabs)");
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.brand}>KEEPING TAB</Text>
        <Text style={styles.hero}>Your savings book, now interactive</Text>
        <Text style={styles.sub}>
          Same cash-envelope challenges — tap, fill, and celebrate.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <GlassPanel key={s.title} style={styles.step}>
              <Text style={styles.stepNum}>{i + 1}</Text>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepBody}>{s.body}</Text>
            </GlassPanel>
          ))}
        </View>

        <Pressable
          onPress={finish}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
          accessibilityLabel="Start saving and open Home"
        >
          <Text style={styles.ctaText}>Start saving</Text>
        </Pressable>
        <Pressable
          onPress={finish}
          style={({ pressed }) => [styles.skip, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={8}
        >
          <Text style={styles.skipText}>Skip to Home</Text>
        </Pressable>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 },
  brand: {
    color: colors.dustyRoseBright,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
  },
  hero: {
    marginTop: 12,
    color: colors.cream,
    fontSize: 30,
    fontWeight: "700",
    fontFamily: "Georgia",
    textAlign: "center",
    lineHeight: 36,
  },
  sub: {
    marginTop: 10,
    color: colors.dustyRoseBright,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  steps: { marginTop: 28, gap: 12, flex: 1 },
  step: {},
  stepNum: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.7,
  },
  stepTitle: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
  },
  stepBody: {
    color: colors.dustyRoseBright,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  cta: {
    marginTop: 16,
    backgroundColor: colors.cream,
    borderRadius: 12,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: colors.burgundy, fontWeight: "800", fontSize: 16 },
  skip: {
    marginTop: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: colors.dustyRoseBright,
    fontWeight: "600",
    fontSize: 14,
  },
});
