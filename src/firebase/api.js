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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";

const usersCollectionRef = collection(db, "users");
const puzzlesCollectionRef = collection(db, "puzzles");

const gridSubcollectionDocId = "answer";
const makeGridSubdocFromGridString = (grid) => ({ gridString: grid }); 

// user-related api functions
export async function createUserEntity(newUser, id) {
  console.log("createUserEntity: received newUser: ", newUser);
  // assuming the user is valid, as the registration process would have caught an error

  // TODO: uncomment after you know puzzles are created with the proper timestamp
  const userCreatedTimestamp = Timestamp.now();
  newUser["createdTimestamp"] = userCreatedTimestamp;
  newUser["updatedTimestamp"] = userCreatedTimestamp;

  try {
    const docRef = doc(usersCollectionRef, id);
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

  // get puzzle grid and remove it from newPuzzleData
  const grid = newPuzzleData.grid;
  delete newPuzzleData.grid;

  try {
    const createPuzzleResult = await addDoc(puzzlesCollectionRef, newPuzzleData);
    console.log("api: createPuzzle: success, created new puzzle: ", createPuzzleResult);
    const newPuzzleRef = doc(db, "puzzles", createPuzzleResult.id);
    const newPuzzleSnapshot = await getDoc(newPuzzleRef);
    
    if (newPuzzleSnapshot.exists()) {
      const newPuzzleData = newPuzzleSnapshot.data();
      // append the id to the data from the snapshot
      newPuzzleData["id"] = newPuzzleSnapshot.id;
      
      console.log("New puzzle snapshot: ", newPuzzleSnapshot);
      console.log("New puzzle Data: ", newPuzzleData);
      
      // save puzzle grid in a subcollection so that it can be reloaded for editing
      const newPuzzleGridSubcollection = collection(newPuzzleRef, "grid");
      const newPuzzleGridDocRef = doc(newPuzzleGridSubcollection, gridSubcollectionDocId);
      await setDoc(newPuzzleGridDocRef, makeGridSubdocFromGridString(grid));

      // check puzzle size
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
    puzzlesCollectionRef, 
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

  // get grid and remove from updatedPuzzleData
  const grid = updatedPuzzleData.grid;
  delete updatedPuzzleData.grid;

  // append puzzle updated timestamp
  const puzzleUpdatedTimestamp = Timestamp.now();
  updatedPuzzleData["updatedTimestamp"] = puzzleUpdatedTimestamp;

  const puzzleDocRef = doc(db, "puzzles", updatedPuzzleData.id);
  const gridCollectionRef = collection(puzzleDocRef, "grid");

  // TODO: Implement
  // create batch for updating doc and grid subcollection at same time
  const batch = writeBatch(db);

  // update the parent doc
  batch.update(puzzleDocRef, updatedPuzzleData);

  // update the document in the subcollection
  const gridDocRef = doc(gridCollectionRef, gridSubcollectionDocId);
  batch.set(gridDocRef, makeGridSubdocFromGridString(grid));

  // run batch update
  await batch.commit();  

  // TODO: temp passthrough - do I need this? should it return a boolean instead?
  return updatedPuzzleData;
}

export async function deletePuzzle(puzzleData){
  console.log("api: deletePuzzle: received puzzleData:", puzzleData);
  const puzzleId = puzzleData.id;

  // get a reference to the puzzle to be deleted
  const puzzleDocRef = doc(puzzlesCollectionRef, puzzleId);

  // delete the doc
  await deleteDoc(puzzleDocRef);
}

export async function getPuzzleGridForPuzzle(puzzleData) {
  console.log("api: getPuzzleGridForPuzzle: received puzzleData: ", puzzleData);

  // pull out puzzleId
  const puzzleId = puzzleData.id;

  if (!puzzleId) {
    console.error("api: getPuzzleGridForPuzzle: puzzleData has no id attached to it.");
    return;
  }

  let loadedGrid = [];

  const puzzleDocRef = doc(puzzlesCollectionRef, puzzleData.id);
  const gridCollectionRef = collection(puzzleDocRef, "grid");
  const gridDocRef = doc(gridCollectionRef, gridSubcollectionDocId);

  // const gridSnapshot = await gridDocRef.get();
  const gridSnapshot = await getDoc(gridDocRef);

  if (gridSnapshot.exists()) {
    const gridData = gridSnapshot.data();

    if (gridData.gridString) {
      const parsedGrid = JSON.parse(gridData.gridString);
      loadedGrid = parsedGrid;
    }
  }

  return loadedGrid;
}
