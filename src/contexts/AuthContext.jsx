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

import { createUserEntity } from "../firebase/api";

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
  
  const login = (
    email, 
    password, 
    successCallback = () => {},
    // TODO: This needs some more thought - what specifically is failing? right now
    //  I'm only using this for one thing, which is an invalid password. it does not
    //  get more specific in the event of an invalid user email
    failureCallback = () => {},
  ) => {
    console.log(`AuthContext: login called for email: ${email}`);

    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("login: success, userCredentials are:", userCredentials);
        successCallback();
        // setUser(userCredentials.user);
      })
      .catch((error) => {
        console.error("auth: login: error logging in: ", error);
        console.log("failureCallback: ", failureCallback);
        console.log("typeof failureCallback: ", typeof failureCallback);
        failureCallback();
      });
  };
  
  const register = (
    email, password, displayName, successCallback = () => {}) => {
    console.log(`AuthContext: register called with email: ${email}, displayName: ${displayName}`);
    let user = null;

    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("register: success, userCredentials are:", userCredentials);
        // const user = userCredentials.user;
        user = userCredentials.user;
        
        // user has been created, create user entity with updated profile
        return updateProfile(user, { displayName });
      })
      .then((updatedCredentials) => {
        // create the user entity in firestore
        console.log("register: success, displayName added.");
        return createUserEntity({ name: user.displayName }, user.uid);
      })
      .then((userEntityCreationSuccess) => {
        console.log("register: success, user entity was created:", userEntityCreationSuccess);
        successCallback()
      })
      .catch((error) => {
        console.error("auth: register: error creating account: ", error);
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
