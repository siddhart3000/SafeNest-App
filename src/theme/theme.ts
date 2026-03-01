export const colors = {
  background: "#0D1117",
  card: "#161B22",
  primary: "#00FF88",
  text: "#E6EDF3",
  muted: "#8B949E",
  danger: "#F87171",
  success: "#22C55E",
  border: "#30363D",
  overlay: "rgba(0, 0, 0, 0.6)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.muted,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.muted,
  },
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};

export type Theme = typeof theme;

