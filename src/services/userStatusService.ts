import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { logError } from "../utils/errorHandler";

interface StatusUpdateParams {
  uid: string;
  familyId?: string | null;
  batteryLevel?: number | null;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
}

export const updateUserRealtimeStatus = async (
  params: StatusUpdateParams
): Promise<void> => {
  const { uid, familyId, batteryLevel, location } = params;

  const userUpdate: Record<string, unknown> = {
    isOnline: true,
    lastOnline: serverTimestamp(),
  };

  if (batteryLevel != null) {
    userUpdate.batteryLevel = batteryLevel;
  }
  if (location) {
    userUpdate.currentLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }

  const updates: Promise<unknown>[] = [
    updateDoc(doc(db, "users", uid), userUpdate),
  ];

  if (familyId) {
    const memberUpdate: Record<string, unknown> = {
      isOnline: true,
      lastOnline: serverTimestamp(),
    };
    if (batteryLevel != null) {
      memberUpdate.batteryLevel = batteryLevel;
    }
    if (location) {
      memberUpdate.lastLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }

    updates.push(
      setDoc(doc(db, "families", familyId, "members", uid), memberUpdate, {
        merge: true,
      })
    );
  }

  try {
    await Promise.all(updates);
  } catch (error) {
    logError("userStatus.updateUserRealtimeStatus", error);
    throw error;
  }
};

export const markUserOffline = async (
  uid: string,
  familyId?: string | null
): Promise<void> => {
  const updates: Promise<unknown>[] = [
    updateDoc(doc(db, "users", uid), {
      isOnline: false,
      lastOnline: serverTimestamp(),
    }),
  ];

  if (familyId) {
    updates.push(
      updateDoc(doc(db, "families", familyId, "members", uid), {
        isOnline: false,
        lastOnline: serverTimestamp(),
      })
    );
  }

  try {
    await Promise.all(updates);
  } catch (error) {
    logError("userStatus.markUserOffline", error);
    throw error;
  }
};

