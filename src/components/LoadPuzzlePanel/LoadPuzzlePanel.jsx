import React, { useState } from 'react';

import "./LoadPuzzlePanel.scss";

import Button from '../Button/Button';

const LoadPuzzlePanel = ({
  deleteUserPuzzle,
  panelIsActive,
  userPuzzles,
}) => {
  const getContainerClassNames = () => `
    puzzle-panel-container
    ${panelIsActive ? "active" : ""}
  `;

  const puzzlesAreValid = userPuzzles && Array.isArray(userPuzzles) && userPuzzles.length > 0;

  const puzzleListItems = puzzlesAreValid ? userPuzzles.map((puzzle, index) => (
    // <li 
    //   className='puzzle-panel-list-item'
    //   key={`puzzle-panel-list-item-${index}`}
    // >
    //   <div className="puzzle-panel-list-item-icon">

    //   </div>

    //   <span className='puzzle-panel-list-item-name'>
    //     {puzzle.name}
    //   </span>

    //   <div className="puzzle-panel-list-item-delete-wrapper">
    //     {
    //       // TODO: Flesh this whole thing out - how does it get the puzzle id?
    //       //  How does it trigger the delete operation?
    //     }
    //     <Button
    //       onClick={() => {
    //         console.log(`Button clicked for ${puzzle}`);
    //         deleteUserPuzzle(puzzle);
    //       }}
    //       type={"delete"}
    //     />
    //   </div>
    // </li>
    <PuzzlePanelListItem
      deleteUserPuzzle={deleteUserPuzzle}
      puzzle={puzzle}
      key={index}
      index={index}
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
  puzzle, 
  index,
}) {
  const [ deleteUnlocked, setDeleteUnlocked ] = useState(false);

  const getDeleteButtonClassNamesString = () => deleteUnlocked ? "delete-unlocked" :"";

  const handleDeleteClick = () => {
    console.log(`Delete Button clicked for ${puzzle.name}`);

    if (!deleteUnlocked) {
      setDeleteUnlocked(true);
      return;
    }

    // we're good, use the delete function
    deleteUserPuzzle(puzzle);
  }

  const handleDeleteMouseOut = () => setDeleteUnlocked(false);

  return (
    <li 
      className='puzzle-panel-list-item'
      key={`puzzle-panel-list-item-${index}`}
    >
      <div className="puzzle-panel-list-item-icon">

      </div>

      <span className='puzzle-panel-list-item-name'>
        {puzzle.name}
      </span>

      <div className="puzzle-panel-list-item-delete-wrapper">
        {
          // TODO: Flesh this whole thing out - how does it get the puzzle id?
          //  How does it trigger the delete operation?
        }
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