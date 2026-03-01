import * as TaskManager from "expo-task-manager";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { logError } from "../utils/errorHandler";

export const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
    if (error || !data) return;

    const locations = (data as any)?.locations;
    const location = locations?.[0];
    if (!location) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const familyId = userSnap.data()?.familyId as string | undefined;

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const updates: Promise<unknown>[] = [];

      updates.push(
        updateDoc(userRef, {
          currentLocation: coords,
          lastOnline: serverTimestamp(),
          isOnline: true,
        })
      );

      if (familyId) {
        updates.push(
          setDoc(
            doc(db, "families", familyId, "members", user.uid),
            {
              lastLocation: coords,
              lastOnline: serverTimestamp(),
              isOnline: true,
            },
            { merge: true }
          )
        );
      }

      await Promise.all(updates);
    } catch (err) {
      logError("backgroundLocationTask", err);
    }
  }
);