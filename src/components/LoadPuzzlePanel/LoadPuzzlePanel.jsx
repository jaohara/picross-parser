import React from 'react';

import "./LoadPuzzlePanel.scss";

import Button from '../Button/Button';

const LoadPuzzlePanel = ({
  panelIsActive,
  userPuzzles,
}) => {
  const getContainerClassNames = () => `
    puzzle-panel-container
    ${panelIsActive ? "active" : ""}
  `;

  // const getClassNames = () => `
  //   puzzle-panel
  //   ${panelIsActive ? "active" : ""}
  // `;

  const puzzlesAreValid = userPuzzles && Array.isArray(userPuzzles) && userPuzzles.length > 0;

  const puzzleListItems = puzzlesAreValid ? userPuzzles.map((puzzle, index) => (
    <li 
      className='puzzle-panel-list-item'
      key={`puzzle-panel-list-item-${index}`}
    >
      <div className="puzzle-panel-list-item-icon">

      </div>

      <span className='puzzle-panel-list-item-name'>
        {puzzle}
      </span>

      <div className="puzzle-panel-list-item-delete-wrapper">
        {
          // TODO: Flesh this whole thing out - how does it get the puzzle id?
          //  How does it trigger the delete operation?
        }
        <Button
          onClick={() => {
            console.log(`Button clicked for ${puzzle}`)
          }}
          type={"delete"}
        />
      </div>
    </li>
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
 
export default LoadPuzzlePanel;