import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

export function signUp(email, password, displayName) {

}

export function signIn(email, password) {
  console.log(`signIn called with email: ${email}, password: ${password}`);
  return ;
}
