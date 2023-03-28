import React, {
  useEffect, 
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';

import "./ImageViewer.scss";

import Pane from '../Pane/Pane';

const ImageViewer = () => {
  return ( 
    <Pane className="image-viewer">
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
 
export default ImageViewer;