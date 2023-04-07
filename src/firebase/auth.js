import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase";

export function signUp(email, password, displayName) {
  return `signUp called with email: ${email}, password: ${password}, displayName: ${displayName}`;
}

export function signIn(email, password) {
  return `signIn called with email: ${email}, password: ${password}`;
}
