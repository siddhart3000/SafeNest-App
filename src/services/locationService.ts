import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "./backgroundLocationTask";
import { logError } from "../utils/errorHandler";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

let backgroundTrackingStarted = false;
let backgroundTrackingStarting = false;

const ensureForegroundPermission = async (): Promise<boolean> => {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.status === "granted") {
      return true;
    }

    const requested = await Location.requestForegroundPermissionsAsync();
    return requested.status === "granted";
  } catch (error) {
    logError("location.ensureForegroundPermission", error);
    return false;
  }
};

export const requestLocationPermissions = async (): Promise<{
  granted: boolean;
  canBackground: boolean;
}> => {
  try {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      return { granted: false, canBackground: false };
    }

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    return { granted: true, canBackground: bgStatus === "granted" };
  } catch (error) {
    logError("location.requestLocationPermissions", error);
    return { granted: false, canBackground: false };
  }
};

export const isLocationServicesEnabled = async (): Promise<boolean> => {
  try {
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    logError("location.isLocationServicesEnabled", error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<Coordinates | null> => {
  try {
    const granted = await ensureForegroundPermission();
    if (!granted) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    logError("location.getCurrentLocation", error);
    return null;
  }
};

export const startBackgroundTracking = async (): Promise<void> => {
  if (backgroundTrackingStarted || backgroundTrackingStarting) {
    return;
  }

  backgroundTrackingStarting = true;

  try {
    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (alreadyRunning) {
      backgroundTrackingStarted = true;
      return;
    }

    const { granted, canBackground } = await requestLocationPermissions();
    if (!granted) {
      logError("location.startBackgroundTracking", "Foreground permission denied");
      return;
    }

    if (!canBackground) {
      logError("location.startBackgroundTracking", "Background permission denied");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10_000,
      distanceInterval: 20,
      foregroundService: {
        notificationTitle: "SafeNest Active",
        notificationBody: "Your location is being shared with your family.",
      },
    });

    backgroundTrackingStarted = true;
  } catch (error) {
    logError("location.startBackgroundTracking", error);
  } finally {
    backgroundTrackingStarting = false;
  }
};

export const stopBackgroundTracking = async (): Promise<void> => {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!isRunning) {
      backgroundTrackingStarted = false;
      backgroundTrackingStarting = false;
      return;
    }

    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    backgroundTrackingStarted = false;
    backgroundTrackingStarting = false;
  } catch (error) {
    logError("location.stopBackgroundTracking", error);
  }
};

