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

import Pane from '../Pane/Pane';

// set to adjust the max dimensions for a picross image
const IMAGE_MAX_DIMENSIONS = { 
  w: 20,
  h: 20,
}

const ImageViewer = ({
  currentImageUrl,
  imageError,
  resetImageError,
  setImageError,
  updateCurrentImageUrl,
}) => {
  // callback for useDropzone to handle dropped files
  const onDrop = useCallback(acceptedFiles => {
    // Now you can do something with "acceptedFiles"
    console.log(acceptedFiles);

    if (acceptedFiles.length === 0) {
      console.error("ImageViewer: onDrop: target file isn't supported.");
      return;
    }

    // pull the image from the acceptedFiles
    const image = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(image);
    console.log("ImageViewer: onDrop: created URL: ", imageUrl);

    // test to see if size is within constraints (less than 20 x 20)
    const sizeCheckImage = new Image();
    sizeCheckImage.src = imageUrl;

    // callback for remainder of logic; updateCurrentImageUrl if valid
    sizeCheckImage.onload = () => {
      const { w, h } = IMAGE_MAX_DIMENSIONS;

      // ensure image is less than max size
      if (sizeCheckImage.width > w && sizeCheckImage.height > h) {
        console.log("ImageViewer: onDrop: setting imageError...");
        setImageError(`Image must be ${w}x${h} or smaller.`);
        return;
      }

      resetImageError();
      updateCurrentImageUrl(imageUrl);
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

  // check for whether or not an image is currently displayed
  const hasImage = currentImageUrl && currentImageUrl.length > 0;

  const getDropZoneClassNameString = () => `
    drop-zone 
    ${isDragActive ? "active" : ""} 
    ${hasImage ? "has-image ": ""} 
  `;

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
        <input {...getInputProps()} />

        <DropMessage 
          hasImage={hasImage}
          isDragActive={isDragActive} 
        />

        <LoadedImage
          imageUrl={currentImageUrl}
        />

      </div>

      <div className="implementation-details">
        <p>
          I'm the drag-and-drop box that you can drop an image in.
        </p>

        <h1>Needs:</h1>
        <ul>
          <li>Drag and drop area for inputting an image</li>
          <li>A way to pass the image data back up to the global app state</li>
          <li>A canvas element to render the scaled-up image</li>
          <li>Probably a hidden image/canvas to store a non-scaled version of the image</li>
        </ul>
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
  const LOADED_IMAGE_BG_COLOR = "#ff0000";
  const FILL_BACKGROUND_ON_IMAGE_LOAD = true;

  // a ref to store the generated <canvas> element
  const canvasRef = useRef(null);

  const fillCanvasBackground = (canvas) => {
    const ctx = canvas.getContext('2d');
    const previousFillStyle = ctx.fillStyle;
    ctx.fillStyle = LOADED_IMAGE_BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = previousFillStyle;
  }

  // an effect to fire when the imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = imageUrl;
  
      img.onload = () => {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (FILL_BACKGROUND_ON_IMAGE_LOAD) {
          fillCanvasBackground(canvas);
        }

        // draw the image
        ctx.drawImage(img, 0, 0);
      };
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
      {/* <img 
        alt="Loaded Image"
        className={getClassNamesString()}
        id="loaded-image"
        src={imageUrl}
      /> */}
      { 
        imageUrl && (
          <canvas 
            ref={canvasRef}
            //hardcoded for now
            height="256"
            width="256"
          />
        )
      }
    </>
  )
}
 
export default ImageViewer;