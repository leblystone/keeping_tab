/** KTab Logo palette — glass on dark burgundy */
export const colors = {
  burgundy: "#48141C",
  burgundyDeep: "#2E0C12",
  cream: "#F0DCD8",
  dustyRose: "#C8A49C",
  /** Higher-contrast secondary text on glass (~AA) */
  dustyRoseBright: "#E8C8C0",
  taupe: "#885C54",
  brown: "#6C4C44",
  sage: "#44704C",
  sageSoft: "rgba(68, 112, 76, 0.35)",
  nude: "#E4DCD8",
  ink: "#2C2824",
  glass: "rgba(240, 220, 216, 0.14)",
  glassBorder: "rgba(240, 220, 216, 0.26)",
  glassStrong: "rgba(240, 220, 216, 0.20)",
  progressTrack: "rgba(240, 220, 216, 0.18)",
  overlay: "rgba(0,0,0,0.35)",
  white: "#FFFFFF",
  transparent: "transparent",
} as const;

export const accentSolid: Record<string, string> = {
  amber: colors.taupe,
  sky: colors.brown,
  rose: colors.dustyRose,
  violet: colors.burgundy,
  emerald: colors.sage,
  fuchsia: colors.taupe,
  orange: colors.brown,
};
