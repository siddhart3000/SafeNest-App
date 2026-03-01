import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../theme/theme";
import { WeatherData } from "../services/weatherService";

interface WeatherCardProps {
  weather: WeatherData | null;
  recommendation: string;
  loading: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  recommendation,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Weather</Text>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Fetching weather…</Text>
        </View>
      ) : weather ? (
        <View style={styles.row}>
          <View>
            <Text style={styles.temperature}>{Math.round(weather.temperature)}°C</Text>
            <Text style={styles.description}>{weather.description}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaText}>Humidity {weather.humidity}%</Text>
            <Text style={styles.metaText}>
              Wind {Math.round(weather.windSpeedKmh)} km/h
            </Text>
            <Text style={styles.metaText}>
              Rain chance {Math.round(weather.rainProbability)}%
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Select a member to load weather.</Text>
      )}

      <View style={styles.recommendation}>
        <Text style={styles.recommendationLabel}>Safety recommendation</Text>
        <Text style={styles.recommendationText}>{recommendation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    backgroundColor: "#0B1220",
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: spacing.sm,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    marginLeft: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: spacing.sm,
  },
  temperature: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    textTransform: "capitalize",
  },
  meta: {
    alignItems: "flex-end",
  },
  metaText: {
    ...typography.caption,
  },
  recommendation: {
    marginTop: spacing.md,
  },
  recommendationLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  recommendationText: {
    ...typography.body,
  },
});

