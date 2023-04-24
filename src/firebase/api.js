// import 
import { 
  addDoc, 
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const usersCollection = collection(db, "users");
const puzzlesCollection = collection(db, "puzzles");

// user-related api functions
export async function createUserEntity(newUser, id) {
  console.log("createUserEntity: received newUser: ", newUser);
  // assuming the user is valid, as the registration process would have caught an error

  // TODO: uncomment after you know puzzles are created with the proper timestamp
  const userCreatedTimestamp = Timestamp.now();
  newUser["createdTimestamp"] = userCreatedTimestamp;
  newUser["updatedTimestamp"] = userCreatedTimestamp;

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

  // build puzzle created and updated timestamp
  const puzzleCreatedTimestamp = Timestamp.now();
  newPuzzleData["createdTimestamp"] = puzzleCreatedTimestamp;
  newPuzzleData["updatedTimestamp"] = puzzleCreatedTimestamp;

  try {
    const createPuzzleResult = await addDoc(puzzlesCollection, newPuzzleData);
    console.log("api: createPuzzle: success, created new puzzle: ", createPuzzleResult);
    const newPuzzleRef = doc(db, "puzzles", createPuzzleResult.id);
    const newPuzzleSnapshot = await getDoc(newPuzzleRef);
    
    if (newPuzzleSnapshot.exists()) {
      const newPuzzleData = newPuzzleSnapshot.data();
      // append the id to the data from the snapshot
      newPuzzleData["id"] = newPuzzleSnapshot.id;

      console.log("New puzzle snapshot: ", newPuzzleSnapshot);
      console.log("New puzzle Data: ", newPuzzleData);

      if (GET_SIZE) {
        const newPuzzleSize = new TextEncoder().encode(JSON.stringify(newPuzzleData)).length;
        const newPuzzleSizeKb = (newPuzzleSize / 1024).toFixed(2);
        console.log(`New puzzle size in kb: ${newPuzzleSizeKb}kb`);
      }

      return newPuzzleData;
    }
  }
  catch (error) {
    console.error("api: createPuzzle: error creating new puzzle: ", error);    
    return error;
  }
}

export async function getUserPuzzles(
  authorId, 
  setUserPuzzles,
  orderByField = "updatedTimestamp",
  // orderByField = "createdTimestamp",
){
  console.log("api: getUserPuzzles: received authorId:", authorId);

  // build query to get all puzzles for the given authorId
  const userPuzzlesQuery = query(
    puzzlesCollection, 
    where("authorId", "==", authorId),
    orderBy(orderByField, "desc"),
  );
  
  // execute the query
  const userPuzzlesSnapshot = await getDocs(userPuzzlesQuery);

  // get the documents from the snapshot
  const userPuzzles = userPuzzlesSnapshot.docs.map((puzzleDocRef) => {
    const puzzleDocData = puzzleDocRef.data();
    puzzleDocData.id = puzzleDocRef.id;
    return puzzleDocData;
  });

  console.log("api: getUserPuzzles: received the following user puzzles: ", userPuzzles);

  // store the puzzles 
  setUserPuzzles(userPuzzles);
}

export async function updatePuzzle(updatedPuzzleData){
  console.log("api: updatePuzzle: received updatedPuzzleData:", updatedPuzzleData);

  // TODO: Implement
}

export async function deletePuzzle(puzzleData){
  console.log("api: deletePuzzle: received puzzleData:", puzzleData);
  const puzzleId = puzzleData.id;

  // get a reference to the puzzle to be deleted
  const puzzleDocRef = doc(puzzlesCollection, puzzleId);

  // delete the doc
  await deleteDoc(puzzleDocRef);
}
