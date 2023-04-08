import { 
  memo,
  useEffect,
  useCallback,
  useState, 
} from 'react'

import "./styles/App.scss";

import ControlBar from "./components/ControlBar/ControlBar";
import ImageMetadata from "./components/ImageMetadata/ImageMetadata";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import LoginWindow from './components/LoginWindow/LoginWindow';

import {
  auth,
} from "./firebase/firebase";

// TODO: Remove - only used for useEffect to confirm configs loaded from env vars
import { devConfig, prodConfig, appEnvironment } from './firebase/firebaseConfig';


import DiagnosticWindow from './components/DiagnosticWindow/DiagnosticWindow';

// This is magic - see "On Memoized Components" note in obsidian vault
const MemoizedImageViewer = memo(ImageViewer);

const DEFAULT_AUTHOR = "Anonymous";
const DEFAULT_NAME = "New puzzle"

function App() {
  // maybe make this handled by a hook?
  const [ author, setAuthor ] = useState(DEFAULT_AUTHOR);
  const [ currentImageUrl, setCurrentImageUrl ] = useState("");
  const [ diagnosticWindowActive, setDiagnosticWindowActive ] = useState(false);
  const [ imageError, setImageError ] = useState(null);
  const [ loginWindowActive, setLoginWindowActive ] = useState(false);
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
  
  const toggleLoginWindow = () => setLoginWindowActive(!loginWindowActive);

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

  const hasImage = currentImageUrl && currentImageUrl.length > 0;

  useEffect(() => {
    // bind window size change event listener on first render
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);


    // TEST: output the config objects

    console.log("appEnvironment: ", appEnvironment);
    console.log("devConfig.projectId: ", devConfig.projectId);
    console.log("prodConfig.projectId: ", prodConfig.projectId);

    // remove event listener when unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!puzzleData) {
      setPuzzleGrid([]);
    }

    puzzleData?.grid && Array.isArray(puzzleData.grid) && setPuzzleGrid(puzzleData.grid);
  }, [puzzleData]);

  const puzzleGridString = puzzleGrid.join("");

  return (
    <div className="App">
      <ControlBar 
        hasImage={hasImage}
        resetImage={resetImage}
        toggleLoginWindow={toggleLoginWindow}
      />

      <LoginWindow
        setWindowActive={setLoginWindowActive}
        windowActive={loginWindowActive}
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

export default App
