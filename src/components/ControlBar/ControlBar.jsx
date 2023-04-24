import React, {
  useContext,
  useState,
} from 'react';

import gridIcon from "../../../public/grid-2.svg";
import "./ControlBar.scss";

import { UserContext } from '../../contexts/UserContext';

import Button from '../Button/Button';

const TEMP_USER_PUZZLES = [
  "Test Puzzle Name 1",
  "Test Puzzle Name 2",
  "Test Puzzle Name 3",
  "Test Puzzle Name 4",
  "Test Puzzle Name 5",
];

const ControlBar = ({
  hasImage,
  hasShadow,
  resetImage,
  savePuzzleDataToDb,
  toggleLoadPuzzlePanel,
  toggleLoginWindow,
  toggleSignupWindow,
  userPuzzles = TEMP_USER_PUZZLES,
}) => {
  const getClassNamesString = () => `
    control-bar
    ${hasShadow ? "shadow-active" : ""}
  `;

  return ( 
    <div className={getClassNamesString()}>
      <Logo />

      <Controls
        hasImage={hasImage} 
        resetImage={resetImage}
        savePuzzleDataToDb={savePuzzleDataToDb}
        toggleLoadPuzzlePanel={toggleLoadPuzzlePanel}
        toggleLoginWindow={toggleLoginWindow}
        toggleSignupWindow={toggleSignupWindow}
        userPuzzles={userPuzzles}
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
  savePuzzleDataToDb,
  toggleLoadPuzzlePanel,
  toggleLoginWindow,
  toggleSignupWindow, 
}) {

  const [ imageIsSaving, setImageIsSaving ] = useState(false);
  // const [ puzzlePanelActive, setPuzzlePanelActive ] = useState(false);

  const { logout, user } = useContext(UserContext);

  const handleSaveImage = () => {
    savePuzzleDataToDb(setImageIsSaving);
  };

  // TODO: This needs to receive whether or not the puzzle is loading from somewhere
  const loadButtonType = "load";

  const saveButtonType = imageIsSaving ? "waiting" : "save";

  const clearImageButton = (      
    <Button
      disabled={!hasImage}
      onClick={resetImage}
      type="clear"
    >
      Clear Puzzle
    </Button>
  );

  return (
    <div className="controls-wrapper">

      {
        !user ? (
          <>
            {clearImageButton}
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
              disabled={!hasImage || imageIsSaving}
              // onClick={savePuzzleDataToDb}
              onClick={handleSaveImage}
              type={saveButtonType}
            >
              {
                imageIsSaving ? "Saving..." : "Save Puzzle"
              }
            </Button>
            <Button
              onClick={toggleLoadPuzzlePanel}
              type={loadButtonType}
            >
              Load Puzzle
            </Button>
            {clearImageButton}
            <Button 
              onClick={logout}
              type='logout'
            >
              Logout
            </Button>
          </>
        )
      }

      {/* <PuzzlePane
        paneIsActive={puzzlePanelActive}
        // paneIsActive={true}
        userPuzzles={userPuzzles}
      /> */}

    </div>
  )
}

function PuzzlePane({
  paneIsActive,
  userName,
  userPuzzles,
}) {
  // how does this receive the list of user puzzles? Should it be in a context or 
  //  passed down?


  const getClassNamesString = () => `
    puzzle-pane
    ${paneIsActive ? "active" : ""}
  `;

  const puzzlesAreValid = userPuzzles && Array.isArray(userPuzzles) && userPuzzles.length > 0;

  const puzzleListItems = puzzlesAreValid ? userPuzzles.map(puzzle => (
    <li>
      <div className="puzzle-list-item-wrapper">
        {puzzle}
      </div>
    </li>
  )) : (
    <li className='puzzle-list-empty'>
      You haven't created any puzzles.
    </li>
  );

  return (
    <div className={getClassNamesString()}>
      <h1>Saved Puzzles</h1>

      <ul>
        {puzzleListItems}
      </ul>
    </div>
  );
};
 
export default ControlBar;