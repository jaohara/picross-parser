import React from 'react';

import gridIcon from "../../../public/grid-2.svg";
import "./ControlBar.scss";

import Button from '../Button/Button';

const ControlBar = ({
  hasImage,
  resetImage,
}) => {
  return ( 
    <div className="control-bar">
      {/* <span className="logo">picross parser.</span> */}
      <Logo />

      <Controls
        hasImage={hasImage} 
        resetImage={resetImage}
      />
    </div>
  );
}

function Logo () {
  return (
    <div className="logo-wrapper">
      <img src={gridIcon} className="grid-icon" alt="" />
      <span className="logo">picross parser.</span>
    </div>
  );
}

function Controls ({
  resetImage
}) {
  return (
    <div className="controls-wrapper">
      <Button
        onClick={resetImage}
        type="clear"
      >
        Clear Image
      </Button>
    </div>
  )
}
 
export default ControlBar;