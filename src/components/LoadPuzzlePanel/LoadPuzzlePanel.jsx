import React, { useState } from 'react';

import "./LoadPuzzlePanel.scss";

import Button from '../Button/Button';
import { getPuzzleGridForPuzzle } from '../../firebase/api';

const LoadPuzzlePanel = ({
  deleteUserPuzzle,
  loadPuzzle,
  panelIsActive,
  toggleLoadPuzzlePanel,
  userPuzzles,
}) => {
  const [ puzzleIsLoading, setPuzzleIsLoading ] = useState(false);

  const getContainerClassNames = () => `
    puzzle-panel-container
    ${panelIsActive ? "active" : ""}
  `;

  const puzzlesAreValid = userPuzzles && Array.isArray(userPuzzles) && userPuzzles.length > 0;

  const puzzleListItems = puzzlesAreValid ? userPuzzles.map((puzzle, index) => (
    <PuzzlePanelListItem
      deleteUserPuzzle={deleteUserPuzzle}
      index={index}
      key={index}
      loadPuzzle={loadPuzzle}
      puzzle={puzzle}
      puzzleIsLoading={puzzleIsLoading}
      setPuzzleIsLoading={setPuzzleIsLoading}
      toggleLoadPuzzlePanel={toggleLoadPuzzlePanel}
    />
  )) : (
    <li className='puzzle-list-empty'>
      You haven't created any puzzles.
    </li>
  );

  return (
    <div
      className={getContainerClassNames()}
    >
      <div className="puzzle-panel">
        <h1>Saved Puzzles</h1>

        <ul className="puzzle-panel-list">
          {puzzleListItems}
        </ul>
      </div>
    </div>
  );
}

function PuzzlePanelListItem ({
  deleteUserPuzzle,
  loadPuzzle,
  puzzle, 
  puzzleIsLoading,
  setPuzzleIsLoading,
  toggleLoadPuzzlePanel,
  index,
}) {
  const [ deleteUnlocked, setDeleteUnlocked ] = useState(false);

  const getListItemClassNamesString = () => `
    puzzle-panel-list-item
    ${puzzleIsLoading ? "loading" : ""}
  `;

  const getDeleteButtonClassNamesString = () => deleteUnlocked ? "delete-unlocked" :"";

  const handleDeleteClick = (e) => {
    if (puzzleIsLoading) {
      return;
    }

    const stopPropogation = () => e && e.stopPropogation && e.stopPropogation();
    
    console.log(`Delete Button clicked for ${puzzle.name}`);
    
    if (!deleteUnlocked) {
      setDeleteUnlocked(true);
      stopPropogation();
      return;
    }

    // we're good, use the delete function
    deleteUserPuzzle(puzzle);
    stopPropogation();
  }

  const handleDeleteMouseOut = () => setDeleteUnlocked(false);

  const handleListItemClick = async (e) => {
    if (puzzleIsLoading) {
      return;
    }

    // ignore click on delete button
    if (e.target && e.target.classList && e.target.classList.contains("app-button")) {
      return;
    }

    setPuzzleIsLoading(true);
    const puzzleGrid = await getPuzzleGridForPuzzle(puzzle);
    console.log("handleListItemClick: received puzzleGrid: ", puzzleGrid);

    const loadedPuzzleData = puzzle;
    loadedPuzzleData.grid = puzzleGrid;

    console.log("handleListItemClick: assembled loaded puzzle data:", loadedPuzzleData);

    // load puzzle, toggle panel off
    loadPuzzle(loadedPuzzleData);
    setPuzzleIsLoading(false);
    toggleLoadPuzzlePanel();
  }

  return (
    <li 
      // className='puzzle-panel-list-item'
      className={getListItemClassNamesString()}
      key={`puzzle-panel-list-item-${index}`}
      onClick={handleListItemClick}
    >
      <div className="puzzle-panel-list-item-icon">
        { 
          // TODO: write function to parse the icon and use here
        }
      </div>

      <span className='puzzle-panel-list-item-name'>
        {puzzle.name}
      </span>

      <div className="puzzle-panel-list-item-delete-wrapper">
        <Button
          className={getDeleteButtonClassNamesString()}
          onClick={handleDeleteClick}
          onMouseOut={handleDeleteMouseOut}
          type={"delete"}
        />
      </div>
    </li>
  )
}
 
export default LoadPuzzlePanel;