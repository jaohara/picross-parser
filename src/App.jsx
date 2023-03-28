// import { 
//   useEffect,
//   useState, 
// } from 'react'

import "./styles/App.scss";

import ControlBar from "./components/ControlBar/ControlBar";
import ImageMetadata from "./components/ImageMetadata/ImageMetadata";
import ImageViewer from "./components/ImageViewer/ImageViewer";


function App() {

  return (
    <div className="App">
      <ControlBar />

      <div className="app-body">
        <ImageViewer />
        <ImageMetadata/>
      </div>
    </div>
  )
}

export default App
