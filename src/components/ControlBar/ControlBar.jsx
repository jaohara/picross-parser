import React from 'react';

import gridIcon from "../../../public/grid-2.svg";
import "./ControlBar.scss";

import { useNavigate } from 'react-router-dom';

import Button from '../Button/Button';

const ControlBar = ({
  hasImage,
  resetImage,
  toggleLoginWindow,
}) => {
  return ( 
    <div className="control-bar">
      {/* <span className="logo">picross parser.</span> */}
      <Logo />

      <Controls
        hasImage={hasImage} 
        resetImage={resetImage}
        toggleLoginWindow={toggleLoginWindow}
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
  hasImage,
  resetImage,
  // TODO: Remove placeholder later
  saveImage = () => { console.log("saveImage clicked!") },
  toggleLoginWindow = () => { console.log("toggleLoginWindow clicked!") },
}) {
  const navigate = useNavigate();

  const USER_IS_LOGGED_IN_PLACEHOLDER = false;

  // const navigateToLogin = () => console.log("navigateToLogin cliked!");
  const navigateToLogin = () => navigate("login");

  return (
    <div className="controls-wrapper">

      {
        !USER_IS_LOGGED_IN_PLACEHOLDER && (
          <Button 
            // onClick={navigateToLogin}
            onClick={toggleLoginWindow}
            type="login"
          >
            Login
          </Button>

        )
      }

      <Button
        disabled={!hasImage}
        onClick={saveImage}
        type="save"
      >
        Save Puzzle 
      </Button>

      <Button
        disabled={!hasImage}
        onClick={resetImage}
        type="clear"
      >
        Clear Image
      </Button>

    </div>
  )
}
 
export default ControlBar;