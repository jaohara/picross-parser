import React from 'react';

import "./Board.scss";

const PUZZLE_FILL_CHAR = "*";

const TEMP_PUZZLE_DATA = {
  colors: [
    "#ff0000",
    "#0000ff",
    "#00ffff",
  ],
  puzzle: [
    // 3 x 3
    // ["0","1","0"],
    // ["0","1","0"],
    // ["0","1","0"],

    // 8 x 8 
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","2","1","0","1"],
    ["0","1","0","1","0","1","0","1"],
    ["0","1","0","1","0","1","0","1"],


    // 15 x 15
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],
    // ["0","1","0","1","0","1","0","1","0","1","0","1","0","1","0"],    
  ],
};

const Board = ({
  puzzleData = TEMP_PUZZLE_DATA,
}) => {
  const { puzzle, colors } = puzzleData;

  const puzzleIsValid = () => puzzle && Array.isArray(puzzle) && puzzle.length > 0;


  const getColorFromSquareData = (squareData) => {
    if (typeof squareData !== "string") {
      console.warning("getColorFromSquareData: squareData is not a string. Defaulting to #FF0000...");
      return "#FF0000";
    }

    console.log(`getColorFromSquareData: getting color from ${squareData}...`)

    // write assuming there is no colon (example) first, and then 
    // also check if there is a colon. 
    if (!squareData.includes(":")) {
      return colors[squareData];
    }

    // squareData currently goes pixelCount:colorIndex
    const colorIndex = squareData.split(":")[1];

    if (!squareData.includes(PUZZLE_FILL_CHAR)) {
      return colors[colorIndex];
    }
    // remember to handle "X" or "*" for filled space 
  };

  return ( 
    <div className="board board-wrapper">
      {
        puzzleIsValid() && puzzle.map((rowData, index) => (
          <Row
            colors={colors}
            getColorFromSquareData={getColorFromSquareData}
            key={`row-${index}`}
            rowData={rowData}
          />
        ))
      }
    </div>
  );
}

function Row ({ 
  colors,
  getColorFromSquareData,
  rowData,
}) {

  // this is assuming rowData is valid
  return (
    <div className="board-row">
      {
        rowData.map((squareData, index) => (
          <Square
            color={getColorFromSquareData(squareData)}
            key={`square-${index}`}
            squareData={squareData}
          />
        ))
      }
    </div>
  );
}

function Square ({
  color = "#FF0000", 
  squareData,
}) {
  // maybe calculate this based on current screen width?
  const squareSize = 48;
  const borderRadius = 12;

  return (
    <div className="board-square">
      {/* Just out put string for now */}
      {/* {squareData} */}

      <svg
        height={squareSize}
        width={squareSize}
      >
        <rect
          height={squareSize}
          width={squareSize}
          rx={borderRadius}
          style={{
            fill: color,
          }}
        />
      </svg>
    </div>
  )
}
 
export default Board;
