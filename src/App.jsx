import { 
  useEffect,
  useCallback,
  useState, 
} from 'react'

import "./styles/App.scss";

import ControlBar from "./components/ControlBar/ControlBar";
import ImageMetadata from "./components/ImageMetadata/ImageMetadata";
import ImageViewer from "./components/ImageViewer/ImageViewer";

function App() {
  // maybe make this handled by a hook?
  const [ currentImageUrl, setCurrentImageUrl ] = useState("");
  const [ imageError, setImageError ] = useState(null);
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);

  const resetImageError = useCallback(() => setImageError(null), [setImageError]);

  // is this necessary? Maybe not
  const updateCurrentImageUrl = useCallback((url) => setCurrentImageUrl(url), [setCurrentImageUrl]);

  const resetImage = useCallback(() => {
    // probably needs more logic?
    setCurrentImageUrl("");
  }, [setCurrentImageUrl]);

  const hasImage = currentImageUrl && currentImageUrl.length > 0;

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

  return (
    <div className="App">
      <ControlBar 
        hasImage={hasImage}
        resetImage={resetImage}
      />

      <div className="app-body">
        <ImageViewer 
          currentImageUrl={currentImageUrl}
          hasImage={hasImage}
          imageError={imageError}
          resetImageError={resetImageError}
          setImageError={setImageError}
          updateCurrentImageUrl={updateCurrentImageUrl}
          windowWidth={windowWidth}
        />
        <ImageMetadata
          imageError={imageError}
        />
      </div>
    </div>
  )
}

export default App
