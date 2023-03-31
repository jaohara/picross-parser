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
import Pane from '../Pane/Pane';

// set to adjust the max dimensions for a picross image
const IMAGE_MAX_DIMENSIONS = { 
  w: 20,
  h: 20,
}

const ImageViewer = ({
  currentImageUrl,
  hasImage,
  imageError,
  puzzleData,
  resetImageError,
  setImageError,
  setPuzzleData,
  updateCurrentImageUrl,
  windowWidth,
}) => {
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
      if (image.width > w && image.height > h) {
        console.log("ImageViewer: onDrop: setting imageError...");
        setImageError(`Image must be ${w}x${h} or smaller.`);
        return;
      }

      // Parse the puzzle
      parseCanvas.width = image.width;
      parseCanvas.height = image.height;
      const ctx = parseCanvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const parsedColors = [];
      const puzzleData = [];

      // should I count the indexes as well?
      let pixelCount = 0;


      const parseColorItem = (item) => {
        let result = item.toString(16);
        return result.length === 1 ? `0${result}` : result;
      }

      // iterate through every pixel
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

      const puzzle = {
        author: "Puzzle creator",
        colors: parsedColors,
        height: image.height,
        name: "New Puzzle",
        puzzle: puzzleString,
        width: image.width,
      };

      resetImageError();
      updateCurrentImageUrl(imageUrl);
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
      <div 
        className={getDropZoneClassNameString()} 
        {...getRootProps()}
      >
        {/* Input box for dropped file */}
        <input 
          {...getInputProps()} 
          disabled={hasImage}
        />

        <DropMessage 
          hasImage={hasImage}
          isDragActive={isDragActive} 
        />

        {/* I might not need this component going forward */}
        {/* <LoadedImage
          imageUrl={currentImageUrl}
        /> */}

        {
          hasImage && (
            <Board 
              puzzleData={puzzleData}
            />
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
    </Pane>
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

function LoadedImage ({ imageUrl }) {
  const DEFAULT_CANVAS_SIZE = 400;
  const FILL_BACKGROUND_ON_IMAGE_LOAD = true;
  const LOADED_IMAGE_BG_COLOR = "#ff0000";
  
  // state to store the size of an edge of the canvas (currently a square
  const [ canvasSize , setCanvasSize ] = useState({
    h: DEFAULT_CANVAS_SIZE,
    w: DEFAULT_CANVAS_SIZE,
  });

  // a ref to store the generated <canvas> element
  const canvasRef = useRef(null);

  const fillCanvasBackground = (canvas) => {
    const ctx = canvas.getContext('2d');
    const previousFillStyle = ctx.fillStyle;
    ctx.fillStyle = LOADED_IMAGE_BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = previousFillStyle;
  }

  const drawImage = () => {
    const displayCanvas = canvasRef.current;
    const displayCtx = displayCanvas.getContext('2d');
    const img = new Image();
    // const imgCanvas = new Canvas();

    img.src = imageUrl;

    img.onload = () => {
      // put image on the imgCanvas to extract colors
      // imgCanvas.height = img.height;
      // imgCanvas.width = img.width;
      // imgCanvas.drawImage(img, 0, 0);

      // clear the canvas
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

      if (FILL_BACKGROUND_ON_IMAGE_LOAD) {
        fillCanvasBackground(displayCanvas);
      }

      // TODO: here's where things get complicated
      /*
        Instead of just drawing the image, what we want to do is this:

          - check the current size of the canvas
          - check the size of the image
          - determine what one pixel in the image maps to on the canvas
          - render that scaled up image, with 
      */

      // draw the image
      displayCtx.drawImage(img, 0, 0);
    };
  }

  // an effect to fire when the imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      drawImage();
    }
    else {
      const canvas = canvasRef.current;
      
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [imageUrl]);

  const getClassNamesString = () => 
    `loaded-image ${imageUrl && imageUrl.length > 0  ? "has-image" : ""}`;

  return (
    <>
      { 
        imageUrl && (
          <canvas 
            ref={canvasRef}
            //hardcoded for now
            height={canvasSize.h}
            width={canvasSize.w}
          />
        )
      }
    </>
  )
}
 
export default ImageViewer;