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
  createUserEntity,
  deletePuzzle,
  getUserPuzzles,
} from "../firebase/api";

import callbackIsValid from "../utils/callbackIsValid";

const UserContext = createContext(undefined);

function UserContextProvider(props) {
  const [ user, setUser ] = useState(auth.currentUser);
  const [ userPuzzles, setUserPuzzles ] = useState([]);

  const addUserPuzzle = (newPuzzleData) => setUserPuzzles([newPuzzleData, ...userPuzzles]);

  const deleteUserPuzzle = (removedPuzzleData) => {
    deletePuzzle(removedPuzzleData);
    setUserPuzzles(userPuzzles.filter((puzzle) => puzzle.id !== removedPuzzleData.id))
  }

  const logout = () => {
    console.log("UserContext: logout: calling logout...");

    return signOut(auth)
      .catch((error) => {
        console.error("UserContext: logout: error: ", error);
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
    console.log(`UserContext: login called for email: ${email}`);

    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("login: success, userCredentials are:", userCredentials);
        callbackIsValid(successCallback) && successCallback();
      })
      .catch((error) => {
        console.error("auth: login: error logging in: ", error);
        callbackIsValid(failureCallback) && failureCallback();
      });
  };
  
  const register = (
    email, 
    password, 
    displayName, 
    successCallback = () => {}
  ) => {
    console.log(`UserContext: register called with email: ${email}, displayName: ${displayName}`);
    let user = null;

    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("register: success, userCredentials are:", userCredentials);
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
        callbackIsValid(successCallback) && successCallback()
      })
      .catch((error) => {
        console.error("auth: register: error creating account: ", error);
      });
  };

  const logUser = () => console.log("UserContext: user: ", user);

  // setup firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);

      // get all user puzzles
      if (user) {
        const fetchData = async () => {
          getUserPuzzles(user.uid, setUserPuzzles);
        };

        fetchData();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        addUserPuzzle,
        deleteUserPuzzle,
        login,
        logout,
        logUser,
        register,
        user,
        userPuzzles,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
