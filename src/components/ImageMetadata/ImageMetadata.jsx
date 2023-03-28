import React from 'react';

import "./ImageMetadata.scss";

import Pane from '../Pane/Pane';

const ImageMetadata = () => {
  return ( 
    <Pane className="image-metadata">
      <p>
        I'm the container that has all of the image metadata.
      </p>
    </Pane>
  );
}
 
export default ImageMetadata;