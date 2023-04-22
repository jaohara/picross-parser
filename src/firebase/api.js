// import 
import { 
  addDoc, 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const usersCollection = collection(db, "users");
const puzzlesCollection = collection(db, "puzzles");

// user-related api functions
export async function createUserEntity(newUser, id) {
  console.log("createUserEntity: received newUser: ", newUser);
  // assuming the user is valid, as the registration process would have caught an error
  try {
    const docRef = doc(usersCollection, id);
    const result = await setDoc(docRef, newUser);
    return result;
  }
  catch (error) {
    return error;
  }
}

// puzzle-related api functions
export async function createPuzzle(newPuzzleData){
  const GET_SIZE = true;

  console.log("api: createPuzzle: received newPuzzleData: ", newPuzzleData);

  try {
    const result = await addDoc(puzzlesCollection, newPuzzleData);
    console.log("api: createPuzzle: success, created new puzzle: ", result);

    if (GET_SIZE) {
      const newPuzzleRef = doc(db, "puzzles", result.id);
      const newPuzzleSnapshot = await getDoc(newPuzzleRef);
      
      if (newPuzzleSnapshot.exists()) {
        console.log("New puzzle snapshot: ", newPuzzleSnapshot);
        console.log("New puzzle Data: ", newPuzzleSnapshot.data());
        const newPuzzleSize = new TextEncoder().encode(JSON.stringify(newPuzzleData)).length;
        
        const newPuzzleSizeKb = (newPuzzleSize / 1024).toFixed(2);
        
        console.log(`New puzzle size in kb: ${newPuzzleSizeKb}kb`);
      }
    }

    return result;
  }
  catch (error) {
    console.error("api: createPuzzle: error creating new puzzle: ", error);    
    return error;
  }
}

export async function getUserPuzzles(authorId, setUserPuzzles){
  console.log("api: getUserPuzzles: received authorId:", authorId);

  // build query to get all puzzles for the given authorId
  const userPuzzlesQuery = query(puzzlesCollection, where("authorId", "==", authorId));
  
  // execute the query
  const userPuzzlesSnapshot = await getDocs(userPuzzlesQuery);

  // get the documents from the snapshot
  const userPuzzles = userPuzzlesSnapshot.docs.map((doc) => doc.data());

  console.log("api: getUserPuzzles: received the following user puzzles: ", userPuzzles);

  // store the puzzles 
  setUserPuzzles(userPuzzles);
}

export async function updatePuzzle(updatedPuzzleData){
  console.log("api: updatePuzzle: received updatedPuzzleData:", updatedPuzzleData);

  // TODO: Implement
}

export async function deletePuzzle(puzzleId){
  console.log("api: updatePuzzle: received updatedPuzzleData:", updatedPuzzleData);

  // TODO: Implement
}
