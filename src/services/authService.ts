import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { logError } from "../utils/errorHandler";

export type AppUser = User;

export const subscribeToAuthChanges = (
  callback: (user: AppUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): AppUser | null => auth.currentUser;

export const loginWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (error) {
    logError("auth.loginWithEmail", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    const defaultName = email.split("@")[0];

    await setDoc(
      doc(db, "users", user.uid),
      {
        name: defaultName,
        email: user.email,
        familyId: null,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    logError("auth.registerWithEmail", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    logError("auth.logout", error);
    throw error;
  }
};

