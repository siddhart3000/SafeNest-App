import * as Battery from "expo-battery";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { logError } from "../utils/errorHandler";

export const getBatteryLevel = async (uid?: string): Promise<number | null> => {
  try {
    const level = await Battery.getBatteryLevelAsync();
    const percentage = level != null ? Math.round(level * 100) : null;

    if (percentage != null && uid) {
      try {
        await updateDoc(doc(db, "users", uid), {
          batteryLevel: percentage,
          lastOnline: serverTimestamp(),
        });
      } catch (error) {
        logError("device.updateUserBatteryLevel", error);
      }
    }

    return percentage;
  } catch (error) {
    logError("device.getBatteryLevel", error);
    return null;
  }
};

export const subscribeBatteryUpdates = (
  uid: string,
  onUpdate?: (percentage: number) => void
): (() => void) => {
  let lastUpdateAt = 0;

  const subscription = Battery.addBatteryLevelListener(async ({ batteryLevel }) => {
    const now = Date.now();
    if (now - lastUpdateAt < 60_000) {
      return;
    }
    lastUpdateAt = now;

    const percentage = Math.round((batteryLevel ?? 0) * 100);
    onUpdate?.(percentage);

    try {
      await updateDoc(doc(db, "users", uid), {
        batteryLevel: percentage,
        lastOnline: serverTimestamp(),
      });
    } catch (error) {
      logError("device.subscribeBatteryUpdates.updateUser", error);
    }
  });

  return () => {
    subscription.remove();
  };
};

