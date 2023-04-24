import { 
  memo,
  useEffect,
  useCallback,
  useState,
  useContext, 
} from 'react'

// import { Sha256 } from '@aws-crypto/sha256-js';
import { createHash } from 'sha256-uint8array';

import "./styles/App.scss";

import ControlBar from "./components/ControlBar/ControlBar";
import DiagnosticWindow from './components/DiagnosticWindow/DiagnosticWindow';
import ImageMetadata from "./components/ImageMetadata/ImageMetadata";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import LoginWindow from './components/LoginWindow/LoginWindow';

import {
  auth,
} from "./firebase/firebase";

import { 
  createPuzzle,
} from "./firebase/api";

import callbackIsValid from './utils/callbackIsValid';
import rotate2dArray from './utils/rotate2dArray';
import sumRowNumbers from './utils/sumRowNumbers';
import splitPuzzleGridByRowWidth from './utils/splitPuzzleGridByRowWidth';

import { UserContext } from './contexts/UserContext';
import LoadPuzzlePanel from './components/LoadPuzzlePanel/LoadPuzzlePanel';

// See "On Memoized Components" note in obsidian vault
const MemoizedImageViewer = memo(ImageViewer);

const DEFAULT_NAME = "New puzzle"

function App() {
  const SHOW_DIAGNOSTIC_WINDOW = false;

  const {
    addUserPuzzle,
    deleteUserPuzzle,
    user,
    userPuzzles,
  } = useContext(UserContext);

  // const [ currentImageUrl, setCurrentImageUrl ] = useState("");
  const [ diagnosticWindowActive, setDiagnosticWindowActive ] = useState(false);
  const [ imageError, setImageError ] = useState(null);
  const [ loginWindowMode, setLoginWindowMode ] = useState("disabled");
  const [ loadPuzzlePanelActive, setLoadPuzzlePanelActive ] = useState(false);
  const [ name, setName ] = useState(DEFAULT_NAME);
  const [ puzzleData, setPuzzleData ] = useState(null);
  // TODO: Not sure if I like this name - this is the B&W grid for the puzzle
  const [ puzzleGrid, setPuzzleGrid ] = useState([]);
  // TODO: Set this when a puzzle is saved, use it to choose create or update operation
  const [ savedPuzzleId, setSavedPuzzleId ] = useState(null);
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);

  const togglePuzzleGridSquare = (pixelCount) => {
    if (pixelCount > puzzleGrid.length){
      return;
    }

    console.log(`togglePuzzleGridSquare firing on ${pixelCount}`);
    
    setPuzzleGrid(currentGrid => {
      const newGrid = [...currentGrid];
      console.log(`Before flipping: `, newGrid);
      newGrid[pixelCount] = newGrid[pixelCount] === 1 ? 0 : 1;
      console.log(`After flipping: `, newGrid);
      return newGrid;
    })
  };

  const resetImageError = useCallback(() => setImageError(null), [setImageError]);

  const savePuzzleDataToDb = (setButtonLock) => {
    if (!user) {
      console.error("savePuzzleDataToDb: cannot save, user is not logged in")
      return;
    }

    if (!puzzleData) {
      console.error("savePuzzleDataToDb: cannot save, puzzleData is null");
      return;
    }

    const savePuzzle = async () => {
      // create a hash from the puzzle name and solution
      const gridHashInput = `${puzzleData.name}${puzzleGrid}`;
      const gridHash = createHash().update(gridHashInput).digest("hex");

      // split the puzzleGrid (solution) and get a rotated copy for columns
      const splitPuzzleGrid = splitPuzzleGridByRowWidth(puzzleGrid, puzzleData.width);
      const rotatedPuzzleGrid = rotate2dArray(splitPuzzleGrid);
      rotatedPuzzleGrid.reverse();

      // helper function to get 2d array in a format for firestore
      const getGridNumbers = (input) => JSON.stringify(input.map((row) => sumRowNumbers(row)));

      // compute row and column numbers
      const rowNumbers = getGridNumbers(splitPuzzleGrid);
      const colNumbers = getGridNumbers(rotatedPuzzleGrid);

      const newPuzzleData = {
        ...puzzleData,
        author: user.displayName,
        authorId: user.uid,
        colNumbers: colNumbers,
        gridHash: gridHash,
        name: name,
        rowNumbers: rowNumbers,
      };
      
      // console.log("savePuzzleDataToDatabase: current puzzleData:", newPuzzleData);
      callbackIsValid(setButtonLock) && setButtonLock(true);
      const createdPuzzleData = await createPuzzle(newPuzzleData);
      addUserPuzzle(createdPuzzleData);
      setSavedPuzzleId(newPuzzleData.id);
      callbackIsValid(setButtonLock) && setButtonLock(false);
    };

    savePuzzle();
  };
  
  const toggleLoginWindow = () => 
    setLoginWindowMode(loginWindowMode === "disabled" ? "login" : "disabled");

  const toggleLoadPuzzlePanel = () => setLoadPuzzlePanelActive(!loadPuzzlePanelActive);
    
  const toggleSignupWindow = () => 
    setLoginWindowMode(loginWindowMode === "disabled" ? "signup" : "disabled");

  const resetImage = useCallback(() => {
    // probably needs more logic?
    setName(DEFAULT_NAME);
    setPuzzleData(null);
    setSavedPuzzleId(null);
    resetImageError();
  }, []);

  // TODO: Ensure that this is working properly now that we're not using currentImageUrl
  const hasImage = puzzleData !== null;

  useEffect(() => {
    // bind window size change event listener on first render
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // remove event listener when unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!puzzleData) {
      setPuzzleGrid([]);
      return;
    }

    const puzzleSize = puzzleData.height * puzzleData.width;
    const grid = new Array(puzzleSize).fill(0);
    setPuzzleGrid(grid);
  }, [puzzleData]);


  // TODO: Remove, use to debug savedPuzzleId being set
  useEffect(() => {
    console.log("savedPuzzleId updated: ", savedPuzzleId);
  }, [savedPuzzleId])

  const puzzleGridString = puzzleGrid.join("");

  return (
    <div className="App">
      <ControlBar 
        hasImage={hasImage}
        hasShadow={loginWindowMode !== "disabled"}
        resetImage={resetImage}
        savePuzzleDataToDb={savePuzzleDataToDb}
        toggleLoadPuzzlePanel={toggleLoadPuzzlePanel}
        toggleLoginWindow={toggleLoginWindow}
        toggleSignupWindow={toggleSignupWindow}
      />

      <LoginWindow
        setWindowMode={setLoginWindowMode}
        windowMode={loginWindowMode}
      />

      <LoadPuzzlePanel
        deleteUserPuzzle={deleteUserPuzzle}
        panelIsActive={loadPuzzlePanelActive}
        userPuzzles={userPuzzles}
      />

      <div className="app-body">
        <MemoizedImageViewer 
          hasImage={hasImage}
          imageError={imageError}
          puzzleData={puzzleData}
          puzzleGrid={puzzleGrid}
          resetImage={resetImage}
          resetImageError={resetImageError}
          setPuzzleData={setPuzzleData}
          setImageError={setImageError}
          togglePuzzleGridSquare={togglePuzzleGridSquare}
          windowWidth={windowWidth}
        />
        <ImageMetadata
          imageError={imageError}
          name={name}
          puzzleData={puzzleData}
          puzzleGridString={puzzleGridString}
          setName={setName}
        />

        {
          SHOW_DIAGNOSTIC_WINDOW && (
            <DiagnosticWindow
              diagnosticWindowActive={diagnosticWindowActive}
              logAuth={logAuth}
              setDiagnosticWindowActive={setDiagnosticWindowActive}
            />
          )
        }
      </div>
    </div>
  )
}

// Log functions to be passed to DiagnosticWindow
const logAuth = () => console.log("firebase.Auth: ", auth);

export default App;
