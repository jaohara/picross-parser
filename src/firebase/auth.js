import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase";

export function signUp(email, password, displayName) {
  console.log(`signUp called with email: ${email}, password: ${password}, displayName: ${displayName}`);
  return;
}

export function signIn(email, password) {
  console.log(`signIn called with email: ${email}, password: ${password}`);
  return ;
}
