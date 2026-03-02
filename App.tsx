import React, { useEffect, useState } from "react";
import { ActivityIndicator, AppState, AppStateStatus, View } from "react-native";
import "./src/services/backgroundLocationTask";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FamilySetupScreen from "./src/screens/FamilySetupScreen";
import { subscribeToAuthChanges, AppUser } from "./src/services/authService";
import { subscribeToUserProfile, UserProfile } from "./src/services/familyService";
import { getBatteryLevel, subscribeBatteryUpdates } from "./src/services/deviceService";
import { getCurrentLocation } from "./src/services/locationService";
import {
  markUserOffline,
  updateUserRealtimeStatus,
} from "./src/services/userStatusService";
import { colors } from "./src/theme/theme";
import { GlobalErrorBoundary } from "./src/components/GlobalErrorBoundary";
import { safeAsync } from "./src/utils/safeAsync";

declare const ErrorUtils: any;

if (!__DEV__) {
  const defaultHandler = ErrorUtils?.getGlobalHandler?.();
  ErrorUtils?.setGlobalHandler?.((error: any, isFatal?: boolean) => {
    console.log("Fatal JS error:", error);
    if (typeof defaultHandler === "function") {
      defaultHandler(error, isFatal);
    }
  });
}

function SafeNestApp() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let isMounted = true;

    const unsubscribeAuth = subscribeToAuthChanges((currentUser) => {
      setLoading(true);

      if (!isMounted) {
        return;
      }

      setUser(currentUser);

      if (currentUser) {
        unsubscribeProfile?.();
        unsubscribeProfile = subscribeToUserProfile(currentUser.uid, (doc) => {
          if (!isMounted) {
            return;
          }
          setProfile(doc);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeBattery = subscribeBatteryUpdates(user.uid);

    let currentState = AppState.currentState;

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (!user) return;

      const movingToBackground =
        currentState === "active" &&
        (nextState === "background" || nextState === "inactive");
      const movingToForeground =
        (currentState === "background" || currentState === "inactive") &&
        nextState === "active";

      currentState = nextState;

      await safeAsync("App.handleAppStateChange", async () => {
        if (movingToBackground) {
          await markUserOffline(user.uid, profile?.familyId ?? null);
        }

        if (movingToForeground) {
          const [batteryLevel, location] = await Promise.all([
            getBatteryLevel(user.uid),
            getCurrentLocation(),
          ]);

          await updateUserRealtimeStatus({
            uid: user.uid,
            familyId: profile?.familyId ?? null,
            batteryLevel: batteryLevel ?? undefined,
            location: location ?? undefined,
          });
        }
      });
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
      unsubscribeBattery();
    };
  }, [user, profile?.familyId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile.familyId) {
    return <FamilySetupScreen />;
  }

  return <HomeScreen familyId={profile.familyId} />;
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <SafeNestApp />
    </GlobalErrorBoundary>
  );
}
