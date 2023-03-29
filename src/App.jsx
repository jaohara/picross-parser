import { 
  // useEffect,
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
  const [ imageError, setImageError ] = useState(null)

  const resetImageError = useCallback(() => setImageError(null), [setImageError]);

  // is this necessary? Maybe not
  const updateCurrentImageUrl = useCallback((url) => setCurrentImageUrl(url), [setCurrentImageUrl]);

  const resetImage = useCallback(() => {
    // probably needs more logic?
    setCurrentImageUrl("");
  }, [setCurrentImageUrl]);

  const hasImage = currentImageUrl && currentImageUrl.length > 0;

  return (
    <div className="App">
      <ControlBar 
        hasImage={hasImage}
        resetImage={resetImage}
      />

      <div className="app-body">
        <ImageViewer 
          currentImageUrl={currentImageUrl}
          imageError={imageError}
          resetImageError={resetImageError}
          setImageError={setImageError}
          updateCurrentImageUrl={updateCurrentImageUrl}
        />
        <ImageMetadata
          imageError={imageError}
        />
      </div>
    </div>
  )
}

export default App
