// src/firebase/auth.ts
import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
} from "firebase/auth";

/** Login with email + password */
export async function loginUser(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Signup, optionally set display name / org name later */
export async function signUpUser(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

/** Logout current user */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// (re-export auth if you want to import it elsewhere)
export { auth };
