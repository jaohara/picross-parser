import React from 'react';

import gridIcon from "../../../public/grid-2.svg";
import "./ControlBar.scss";

const ControlBar = () => {
  return ( 
    <div className="control-bar">
      {/* <span className="logo">picross parser.</span> */}
      <Logo />
    </div>
  );
}

function Logo () {
  return (
    <>
      <img src={gridIcon} className="grid-icon" alt="" />
      <span className="logo">picross parser.</span>
    </>
  )
}
 
export default ControlBar;