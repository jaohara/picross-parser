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

// TODO: Remove - only used for useEffect to confirm configs loaded from env vars
import { devConfig, prodConfig, appEnvironment } from './firebase/firebaseConfig';

import { AuthContext } from './contexts/AuthContext';

// This is magic - see "On Memoized Components" note in obsidian vault
const MemoizedImageViewer = memo(ImageViewer);

const DEFAULT_AUTHOR = "Anonymous";
const DEFAULT_NAME = "New puzzle"

function App() {
  const {
    user
  } = useContext(AuthContext);


  // maybe make this handled by a hook?

  // TODO: REMOVE THIS, insert user.displayName at save instead
  const [ author, setAuthor ] = useState();


  const [ currentImageUrl, setCurrentImageUrl ] = useState("");
  const [ diagnosticWindowActive, setDiagnosticWindowActive ] = useState(false);
  const [ imageError, setImageError ] = useState(null);
  const [ loginWindowMode, setLoginWindowMode ] = useState("disabled");
  const [ name, setName ] = useState(DEFAULT_NAME);
  const [ puzzleData, setPuzzleData ] = useState(null);
  // TODO: Not sure if I like this name - this is the B&W grid for the puzzle
  const [ puzzleGrid, setPuzzleGrid ] = useState([]);
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);

  /* 
    puzzleData has this form:

      puzzleData = {
        author: "Puzzle creator",
        colors: ["hex", "color", "strings"],
        height: 15
        name: "New Puzzle",
        puzzle: [["pixel", "data"], ["in", "rows"]],
        width: 15,
      };
  */

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

  const savePuzzleDataToDatabase = () => {
    if (!puzzleData) {
      console.error("savePuzzleDataToDatabase: cannot save, puzzleData is null");
      return;
    }

    const savePuzzle = async () => {
      // const gridHash = new Sha256();
      // gridHash.update(puzzleGrid);
      // const gridHashDigest = await gridHash.digest();

      const hashInput = `${puzzleData.name}${puzzleGrid}`;
      console.log("hashInput: ", hashInput);
      const gridHash = createHash().update(hashInput).digest("hex");
      console.log("gridHash: ", gridHash);

      const compiledPuzzleData = {
        ...puzzleData,
        author: user.displayName,
        grid: puzzleGrid,
        // gridHash: gridHash,
      };

  
      console.log("savePuzzleDataToDataBase: current puzzleData:", compiledPuzzleData);
    };

    savePuzzle();
  };
  
  const toggleLoginWindow = () => 
    setLoginWindowMode(loginWindowMode === "disabled" ? "login" : "disabled");
    
  const toggleSignupWindow = () => 
    setLoginWindowMode(loginWindowMode === "disabled" ? "signup" : "disabled");

  // is this necessary? Maybe not
  const updateCurrentImageUrl = useCallback((url) => setCurrentImageUrl(url), [setCurrentImageUrl]);

  const resetImage = useCallback(() => {
    // probably needs more logic?
    setAuthor(DEFAULT_AUTHOR);
    setCurrentImageUrl("");
    setName(DEFAULT_NAME);
    setPuzzleData(null);
    resetImageError();
  }, [setCurrentImageUrl]);

  // TODO: Ensure that this is working properly now that we're not using currentImageUrl
  // const hasImage = currentImageUrl && currentImageUrl.length > 0;
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

  const puzzleGridString = puzzleGrid.join("");

  return (
    <div className="App">
      <ControlBar 
        hasImage={hasImage}
        resetImage={resetImage}
        savePuzzleDataToDatabase={savePuzzleDataToDatabase}
        toggleLoginWindow={toggleLoginWindow}
        toggleSignupWindow={toggleSignupWindow}
      />

      <LoginWindow
        setWindowMode={setLoginWindowMode}
        windowMode={loginWindowMode}
      />

      <div className="app-body">
        {/* <ImageViewer  */}
        <MemoizedImageViewer 
          currentImageUrl={currentImageUrl}
          hasImage={hasImage}
          imageError={imageError}
          puzzleData={puzzleData}
          puzzleGrid={puzzleGrid}
          resetImage={resetImage}
          resetImageError={resetImageError}
          setPuzzleData={setPuzzleData}
          setImageError={setImageError}
          togglePuzzleGridSquare={togglePuzzleGridSquare}
          updateCurrentImageUrl={updateCurrentImageUrl}
          windowWidth={windowWidth}
        />
        <ImageMetadata
          author={author}
          imageError={imageError}
          name={name}
          puzzleData={puzzleData}
          puzzleGridString={puzzleGridString}
          setAuthor={setAuthor}
          setName={setName}
        />

        <DiagnosticWindow
          diagnosticWindowActive={diagnosticWindowActive}
          logAuth={logAuth}
          setDiagnosticWindowActive={setDiagnosticWindowActive}
        />

        
      </div>
    </div>
  )
}


// Log functions to be passed to DiagnosticWindow
const logAuth = () => console.log("firebase.Auth: ", auth);

export default App;
