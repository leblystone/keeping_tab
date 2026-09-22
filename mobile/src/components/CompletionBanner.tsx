import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

/** Readable celebration — cream on sage, with pop + confetti dots */
export function CompletionBanner({ visible }: { visible: boolean }) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const confetti = useRef(
    [...Array(8)].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      o: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(0.9);
      opacity.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    confetti.forEach((c, i) => {
      c.x.setValue(0);
      c.y.setValue(0);
      c.o.setValue(1);
      Animated.parallel([
        Animated.timing(c.x, {
          toValue: (i % 2 === 0 ? 1 : -1) * (20 + i * 8),
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(c.y, {
          toValue: -30 - i * 6,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(c.o, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [visible, scale, opacity, confetti]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ scale }] }]}>
      <View style={styles.banner}>
        <Text style={styles.title}>Challenge completed!</Text>
        <Text style={styles.sub}>You stuffed this envelope — nice work.</Text>
      </View>
      {confetti.map((c, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i % 2 ? colors.cream : colors.nude,
              opacity: c.o,
              transform: [{ translateX: c.x }, { translateY: c.y }],
              left: 20 + i * 28,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, position: "relative", overflow: "visible" },
  banner: {
    backgroundColor: colors.sage,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(240,220,216,0.35)",
  },
  title: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "700",
  },
  sub: {
    color: colors.nude,
    fontSize: 13,
    marginTop: 4,
  },
  dot: {
    position: "absolute",
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
