import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

import { 
  signIn,
  signUp
} from "../firebase/auth";

const AuthContext = createContext(undefined);

function AuthContextProvider(props) {
  const [ user, setUser ] = useState(auth.currentUser);

  const logout = () => {
    console.log("AuthContext: logout: calling logout...");

    return signOut(auth)
      .catch((error) => {
        console.error("AuthContext: logout: error: ", error);
      })
  };
  
  const login = (email, password) => {
    console.log(`AuthContext: login called for email: ${email}`);

    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("login: success, userCredentials are:", userCredentials);
        // setUser(userCredentials.user);
      })
      .catch((error) => {
        console.error("auth: login: error logging in: ", error);
      });
  };
  
  const register = (email, password, displayName) => {
    console.log(`AuthContext: register called with email: ${email}, displayName: ${displayName}`);

    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("register: success, userCredentials are:", userCredentials);
        
        const user = userCredentials.user;
        return updateProfile(user, { displayName });
      })
      .then((updatedCredentials) => {
        console.log("register: success, updatedCredentials are:", updatedCredentials);
        // setUser(updatedCredentials.user);
      })
      .catch((error) => {
        console.error("auth: signUp: error creating account: ", error);
      });
  };

  const logUser = () => console.log("AuthContext: user: ", user);

  // setup firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        logUser,
        register,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
