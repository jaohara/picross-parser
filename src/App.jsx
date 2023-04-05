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
import { devConfig, prodConfig, appEnvironment } from './firebase';

// This is magic - see "On Memoized Components" note in obsidian vault
const MemoizedImageViewer = memo(ImageViewer);

const DEFAULT_AUTHOR = "Anonymous";
const DEFAULT_NAME = "New puzzle"

function App() {
  // maybe make this handled by a hook?
  const [ author, setAuthor ] = useState(DEFAULT_AUTHOR);
  const [ currentImageUrl, setCurrentImageUrl ] = useState("");
  const [ imageError, setImageError ] = useState(null);
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
      console.log(`Before flipping: `, currentGrid);
      currentGrid[pixelCount] = currentGrid[pixelCount] === 1 ? 0 : 1;
      console.log(`After flipping: `, currentGrid);
      return currentGrid;
    })
  };

  const resetImageError = useCallback(() => setImageError(null), [setImageError]);

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
      </div>
    </div>
  )
}

export default App
