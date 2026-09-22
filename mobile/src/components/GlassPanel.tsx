import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "../theme/colors";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  strong?: boolean;
};

export function GlassPanel({ children, style, strong }: Props) {
  return (
    <View style={[styles.wrap, strong && styles.strong, style]}>
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  strong: {
    backgroundColor: colors.glassStrong,
  },
  inner: {
    padding: 16,
  },
});
