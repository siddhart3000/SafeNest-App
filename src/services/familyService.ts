import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { logError } from "../utils/errorHandler";
import { UserDocument } from "../types/user";

export interface FamilyMember {
  id: string;
  name: string;
  role?: string | null;
  photoURL?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  batteryLevel?: number | null;
  lastOnline?: any;
  isOnline?: boolean;
}

export interface UserProfile extends UserDocument {}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return (snap.exists() ? (snap.data() as UserProfile) : null);
  } catch (error) {
    logError("family.getUserProfile", error);
    throw error;
  }
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfile | null) => void
): (() => void) => {
  const ref = doc(db, "users", uid);
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? (snap.data() as UserProfile) : null);
    },
    (error) => {
      logError("family.subscribeToUserProfile", error);
      callback(null);
    }
  );
};

export const createFamilyForUser = async (uid: string, displayName: string | null) => {
  const familyId = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    await setDoc(doc(db, "families", familyId), {
      createdAt: serverTimestamp(),
      createdBy: uid,
    });

    await setDoc(doc(db, "families", familyId, "members", uid), {
      name: displayName ?? "Member",
      role: null,
      photoURL: null,
      isOnline: true,
      lastOnline: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", uid), {
      familyId,
    });

    return familyId;
  } catch (error) {
    logError("family.createFamilyForUser", error);
    throw error;
  }
};

export const joinFamilyByCode = async (uid: string, code: string, displayName: string | null) => {
  const familyCode = code.trim().toUpperCase();

  try {
    const familySnap = await getDoc(doc(db, "families", familyCode));
    if (!familySnap.exists()) {
      throw new Error("Family code not found");
    }

    await setDoc(doc(db, "families", familyCode, "members", uid), {
      name: displayName ?? "Member",
      role: null,
      photoURL: null,
      isOnline: true,
      lastOnline: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", uid), {
      familyId: familyCode,
    });
  } catch (error) {
    logError("family.joinFamilyByCode", error);
    throw error;
  }
};

export const subscribeToFamilyMembers = (
  familyId: string,
  callback: (members: FamilyMember[]) => void
) => {
  const membersRef = collection(db, "families", familyId, "members");
  return onSnapshot(
    membersRef,
    (snapshot) => {
      const members: FamilyMember[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const location = data.lastLocation || data.currentLocation;
        members.push({
          id: docSnap.id,
          name: data.name ?? "Member",
          role: data.role ?? null,
          photoURL: data.photoURL ?? null,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          batteryLevel: data.batteryLevel ?? null,
          lastOnline: data.lastOnline ?? data.updatedAt ?? null,
          isOnline: data.isOnline ?? false,
        });
      });
      callback(members);
    },
    (error) => {
      logError("family.subscribeToFamilyMembers", error);
      callback([]);
    }
  );
};

