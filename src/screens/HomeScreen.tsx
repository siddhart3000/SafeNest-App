import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapScreen from "./MapScreen";
import ProfileScreen from "./ProfileScreen";
import { startBackgroundTracking, stopBackgroundTracking } from "../services/locationService";
import { logout } from "../services/authService";
import { colors, radius, spacing, typography } from "../theme/theme";
import { getErrorMessage } from "../utils/errorHandler";

interface HomeScreenProps {
  familyId: string;
}

export default function HomeScreen({ familyId }: HomeScreenProps) {
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await startBackgroundTracking();
        setTracking(true);
      } catch (error) {
        Alert.alert("Location tracking", getErrorMessage(error, "Unable to start tracking."));
      } finally {
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      stopBackgroundTracking().catch(() => undefined);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await stopBackgroundTracking();
      await logout();
    } catch (error) {
      Alert.alert("Sign out failed", getErrorMessage(error, "Unable to sign out."));
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Booting SafeNest engine…</Text>
      </View>
    );
  }

  if (showProfile) {
    return <ProfileScreen familyId={familyId} onBack={() => setShowProfile(false)} />;
  }

  const trackingLabel = tracking ? "Tracking active" : "Tracking paused";

  return (
    <View style={styles.container}>
      <MapScreen familyId={familyId} />

      <View style={styles.topBar}>
        <Text style={styles.logo}>SafeNest</Text>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowProfile(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: tracking ? colors.primary : colors.danger },
            ]}
          >
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{trackingLabel}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loaderText: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  topBar: {
    position: "absolute",
    top: 48,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 1.1,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    backgroundColor: "rgba(0, 255, 136, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  profileButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.background,
    marginRight: 6,
  },
  statusText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  logoutButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});