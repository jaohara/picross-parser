import React, {
  useContext,
} from 'react';

import gridIcon from "../../../public/grid-2.svg";
import "./ControlBar.scss";

import { AuthContext } from '../../contexts/AuthContext';

import Button from '../Button/Button';

const ControlBar = ({
  hasImage,
  resetImage,
  savePuzzleDataToDatabase,
  toggleLoginWindow,
  toggleSignupWindow,
}) => {
  return ( 
    <div className="control-bar">
      {/* <span className="logo">picross parser.</span> */}
      <Logo />

      <Controls
        hasImage={hasImage} 
        resetImage={resetImage}
        savePuzzleDataToDatabase={savePuzzleDataToDatabase}
        toggleLoginWindow={toggleLoginWindow}
        toggleSignupWindow={toggleSignupWindow}
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
  // savePuzzleDataToDatabase = () => { console.log("saveImage clicked!") },
  savePuzzleDataToDatabase,
  toggleLoginWindow = () => { console.log("toggleLoginWindow clicked!") },
  toggleSignupWindow = () => { console.log("toggleSignupWindow clicked!")}, 
}) {

  const { logout, user } = useContext(AuthContext);

  return (
    <div className="controls-wrapper">

      {
        !user ? (
          <>
            <Button 
              onClick={toggleLoginWindow}
              type="login"
            >
              Login
            </Button>
            <Button 
              onClick={toggleSignupWindow}
              type="signup"
            >
              Register
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={logout}
              type='logout'
            >
              Logout
            </Button>
            <Button
              disabled={!hasImage}
              onClick={savePuzzleDataToDatabase}
              type="save"
            >
              Save Puzzle 
            </Button>
          </>
        )
      }

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