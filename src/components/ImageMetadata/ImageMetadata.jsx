import React from 'react';

// import 

import "./ImageMetadata.scss";

import Pane from '../Pane/Pane';

const ImageMetadata = ({ 
  imageError,
  puzzleData
}) => {
  return ( 
    <Pane className="image-metadata">
      {
        imageError && (
          <ImageErrorMessage message={imageError} />
        )
      }
      {
        puzzleData && (
          <PuzzleDataTemp puzzleData={puzzleData} />
        )
      }
    </Pane>
  );
}

function ImageErrorMessage ({ message }) {
  return (
    <div className="image-error-message">
      {message}
    </div>
  );
}

function PuzzleDataTemp ({ puzzleData }) {
  return (
    <div className="puzzle-data-temp">
      <strong>puzzleData</strong>:{ }{JSON.stringify(puzzleData)}
    </div>
  )
}
 
export default ImageMetadata;