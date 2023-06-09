import React, {
  useCallback,
  useEffect, 
  useRef,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';

import { 
  TbDragDrop,
  TbThumbUp,
} from "react-icons/tb";

import "./ImageViewer.scss";

import Board from '../Board/Board';
import Button from '../Button/Button';
import Pane from '../Pane/Pane';

// set to adjust the max dimensions for a picross image
const IMAGE_MAX_DIMENSIONS = { 
  w: 20,
  h: 20,
}

const ImageViewer = ({
  // currentImageUrl,
  hasImage,
  imageError,
  puzzleData,
  puzzleGrid,
  resetImage,
  resetImageError,
  setImageError,
  setPuzzleData,
  togglePuzzleGridSquare,
  // updateCurrentImageUrl,
  windowWidth,
}) => {
  // defaults to off, or color view
  const [ gridViewActive, setGridViewActive ] = useState(false);
  const [ puzzleGridOpacity, setPuzzleGridOpacity ] = useState(100);

  // the canvas ref for the parseCanvas
  const parseCanvasRef = useRef(null);

  // callback for useDropzone to handle dropped files
  const onDrop = useCallback(acceptedFiles => {
    // Now you can do something with "acceptedFiles"
    console.log(acceptedFiles);

    if (acceptedFiles.length === 0) {
      console.error("ImageViewer: onDrop: target file isn't supported.");
      return;
    }

    // pull the image from the acceptedFiles
    const imageFile = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(imageFile);
    console.log("ImageViewer: onDrop: created URL: ", imageUrl);

    const image = new Image();
    const parseCanvas = parseCanvasRef.current;
    image.src = imageUrl;

    // callback for remainder of logic; updateCurrentImageUrl if valid
    image.onload = () => {
      const { w, h } = IMAGE_MAX_DIMENSIONS;

      // ensure image is less than max size
      if (image.width > w || image.height > h) {
        console.log("ImageViewer: onDrop: setting imageError...");
        setImageError(`Image must be ${w}x${h} or smaller.`);
        return;
      }

      resetImage();

      // Parse the puzzle
      parseCanvas.width = image.width;
      parseCanvas.height = image.height;
      const ctx = parseCanvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const parsedColors = [];
      const puzzleData = [];

      // should I count the indexes as well?
      let pixelCount = 0;

      // =================================================================
      // iterate through every pixel to record colors
      // =================================================================

      const parseColorItem = (item) => {
        let result = item.toString(16);
        return result.length === 1 ? `0${result}` : result;
      }

      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          // data is pixel color as array in [r, g, b, a] format
          const { data } = ctx.getImageData(x, y, 1, 1);
          // const r = data[0].toString(16);
          const r = parseColorItem(data[0]);
          // const g = data[1].toString(16);
          const g = parseColorItem(data[1]);
          // const b = data[2].toString(16);
          const b = parseColorItem(data[2]);
          // const a = data[3].toString(16);
          const a = parseColorItem(data[3]);
          const pixelColor = `#${r}${g}${b}${a}`;

          let pixelColorIndex = parsedColors.indexOf(pixelColor);
          let pixelString = `${pixelCount}:`;

          // if it doesn't exist, add it and get the new index
          if (pixelColorIndex === -1) {
            pixelColorIndex = parsedColors.push(pixelColor) - 1;
          }

          // now pixelColorIndex is a valid index, append the index
          pixelString += pixelColorIndex;
          
          // TODO: if we knew whether this square was part of the b&w puzzle, we could 
          //  append the symbol (x? asterisk?) to indicate, but skip for now.

          // add pixelString to puzzleData
          puzzleData.push(pixelString);
          pixelCount++;
        }
      }

      const puzzleString = puzzleData.join();


      // ==============================================================
      // TODO: Maybe not the best place for this to live - this is the type definiton
      //  for what puzzleData is.
      const puzzle = {
        // author: "Puzzle creator",
        colors: parsedColors,
        // grid: grid,
        height: image.height,
        name: "New Puzzle",
        puzzle: puzzleString,
        width: image.width,
      };
      // ==============================================================

      
      resetImageError();
      // TODO: Am I still using this?
      // updateCurrentImageUrl(imageUrl);
      setPuzzleData(puzzle);
    };
    // empty dependency array
  }, []);

  // initialize drag and drop functionality with useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    accept: {
      'image/gif': [],
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    onDrop,
    maxFiles: 1,
  });

  const getDropZoneClassNameString = () => `
    drop-zone 
    ${isDragActive ? "active" : ""} 
    ${hasImage ? "has-image ": ""} 
  `;

  // useEffect for window resizing
  useEffect(() => {
    console.log("window.innerWidth is: ", windowWidth);
  }, [windowWidth]);

  useEffect(() => {
    // first render useEffect for testing stuff
  }, []);

  return ( 
    <Pane className="image-viewer">
      {
        hasImage && (
          <h1 className="puzzle-grid-header">
            Puzzle Grid
          </h1>
        )
      }
      <div 
        className={getDropZoneClassNameString()} 
        {...getRootProps()}
      >
        {/* Input box for dropped file */}
        <input 
          {...getInputProps()} 
          disabled={hasImage}
        />

        {/* Prompt for dropzone */}
        <DropMessage 
          hasImage={hasImage}
          isDragActive={isDragActive} 
        />

        {/* Render any imageErrors  */}
        {
          imageError && (
            <ImageErrorMessage message={imageError} />
          )
        }

        {/* Render board */}
        {
          hasImage && (
            <>
              <Board 
                gridViewActive={gridViewActive}
                puzzleData={puzzleData}
                puzzleGrid={puzzleGrid}
                puzzleOpacity={puzzleGridOpacity}
                togglePuzzleGridSquare={togglePuzzleGridSquare}
              />
            </>
          )
        }

        {/* The hidden parseCanvas for loading the image */}
        <canvas
          className='parse-canvas'
          ref={parseCanvasRef}
          // arbitrary; resized in onDrop 
          height={20}
          width={20}
        />
      </div>

      {/* Render controls */}
      {
        hasImage && (
          <ImageViewerControls
            gridViewActive={gridViewActive}
            puzzleGridOpacity={puzzleGridOpacity}
            toggleColorOrGridView={() => setGridViewActive(!gridViewActive)}
            setPuzzleGridOpacity={setPuzzleGridOpacity}
          />
        )
      }
    </Pane>
  );
}

function ImageViewerControls ({
  gridViewActive,
  puzzleGridOpacity,
  toggleColorOrGridView = () => console.log("toggleColorOrGridView fired"),
  setPuzzleGridOpacity,
}) {
  return (
    <div className="image-viewer-controls">
      <Button 
        type={gridViewActive ? "puzzle-off" : "puzzle-on"}
        onClick={toggleColorOrGridView}
      >
        Toggle { gridViewActive ? "Color" : "Puzzle"}{" "}View
      </Button>

      <div className="image-viewer-controls-opacity-slider-wrapper">
        <label>Grid Opacity</label>
        <input 
          className="image-viewer-controls-opacity-slider"
          max="1"
          min="0" 
          onChange={e => setPuzzleGridOpacity(e.target.value)}
          step={.01}
          type="range"
          value={puzzleGridOpacity}
        />
      </div>
    </div>
  )
}

function ImageErrorMessage ({ message }) {
  return (
    <div className="image-error-message">
      {message}
    </div>
  );
}

// the message that gives you the action prompt for dropping an image
function DropMessage({ 
  isDragActive,
  hasImage,
}) {
  const getClassNamesString = () => `drop-message ${hasImage ? "has-image" : ""}`;

  return (
    <div 
      // className="drop-message"
      className={getClassNamesString()}
    >
      { 
        isDragActive ? (
          <>
            <div className="drop-message-icon-wrapper">
              <TbThumbUp />
            </div>
            <p>Drop your image file here.</p>
          </>
        ) : (
          <>
            <div className="drop-message-icon-wrapper">
              <TbDragDrop />
            </div>
            <p>Drag an image file here.</p>
          </>
        )

      }
    </div>
  );
}

 
export default ImageViewer;