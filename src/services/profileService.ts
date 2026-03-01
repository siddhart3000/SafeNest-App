import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { logError } from "../utils/errorHandler";

export interface EditableProfile {
  name: string;
  role: string | null;
  photoURL: string | null;
}

export const loadInitialProfile = async (
  uid: string,
  familyId: string | null,
  fallbackName: string
): Promise<EditableProfile> => {
  try {
    if (familyId) {
      const memberSnap = await getDoc(doc(db, "families", familyId, "members", uid));
      if (memberSnap.exists()) {
        const data = memberSnap.data() as any;
        return {
          name: data.name ?? fallbackName,
          role: data.role ?? null,
          photoURL: data.photoURL ?? null,
        };
      }
    }

    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      const data = userSnap.data() as any;
      return {
        name: data.name ?? fallbackName,
        role: data.role ?? null,
        photoURL: data.photoURL ?? null,
      };
    }
  } catch (error) {
    logError("profile.loadInitialProfile", error);
  }

  return {
    name: fallbackName,
    role: null,
    photoURL: null,
  };
};

export const uploadProfilePhoto = async (
  uid: string,
  familyId: string | null,
  uri: string
): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profiles/${uid}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    const updates = [
      updateDoc(doc(db, "users", uid), {
        photoURL: downloadURL,
        updatedAt: serverTimestamp(),
      }),
    ];

    if (familyId) {
      updates.push(
        updateDoc(doc(db, "families", familyId, "members", uid), {
          photoURL: downloadURL,
          updatedAt: serverTimestamp(),
        })
      );
    }

    await Promise.all(updates);
    return downloadURL;
  } catch (error) {
    logError("profile.uploadProfilePhoto", error);
    throw error;
  }
};

export const saveProfile = async (
  uid: string,
  familyId: string | null,
  profile: EditableProfile
): Promise<void> => {
  const safeName = profile.name.trim() || "Member";

  try {
    const updates = [
      updateDoc(doc(db, "users", uid), {
        name: safeName,
        role: profile.role,
        photoURL: profile.photoURL,
        updatedAt: serverTimestamp(),
      }),
    ];

    if (familyId) {
      updates.push(
        setDoc(
          doc(db, "families", familyId, "members", uid),
          {
            name: safeName,
            role: profile.role,
            photoURL: profile.photoURL,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      );
    }

    await Promise.all(updates);
  } catch (error) {
    logError("profile.saveProfile", error);
    throw error;
  }
};

