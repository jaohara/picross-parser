import React from 'react';

// import 

import "./ImageMetadata.scss";

import Pane from '../Pane/Pane';

const ImageMetadata = ({ imageError }) => {
  return ( 
    <Pane className="image-metadata">
      {
        imageError && (
          <ImageErrorMessage message={imageError} />
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
 
export default ImageMetadata;