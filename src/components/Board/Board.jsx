import React, { useEffect } from 'react';

import "./Board.scss";

const PUZZLE_FILL_CHAR = "*";
const PUZZLE_SQUARE_DELIMITER = ","

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
  const { colors } = puzzleData;

  // parse the puzzle array form the string
  const puzzle = (() => {
    // for demo examples where the data comes in as an already parsed array
    if (Array.isArray(puzzleData.puzzle)) {
      return puzzleData.puzzle;
    }

    // assuming it has a valid height/width properties
    const { height, width } = puzzleData;
    const result = [];

    const splitPuzzleData = puzzleData.puzzle.split(PUZZLE_SQUARE_DELIMITER);
    let squareIndex = 0;

    // WARNING: you might be crossing up the x/y here; make sure to check
    for (let y = 0; y < height; y++) {
      result.push([]);

      for (let x = 0; x < width; x++) {
        result[y][x] = splitPuzzleData[squareIndex];
        squareIndex++;
      }
    }

    return result;
  })();


  const puzzleIsValid = () => puzzle && Array.isArray(puzzle) && puzzle.length > 0;


  const getColorFromSquareData = (squareData) => {
    if (typeof squareData !== "string") {
      console.warning("getColorFromSquareData: squareData is not a string. Defaulting to #FF0000...");
      return "#FF0000";
    }

    console.log(`getColorFromSquareData: getting color from ${squareData}...`);

    if (!squareData.includes(":")) {
      return colors[squareData];
    }

    // squareData currently goes pixelCount:colorIndex
    const colorIndex = squareData.split(":")[1];

    if (!squareData.includes(PUZZLE_FILL_CHAR)) {
      return colors[colorIndex];
    }

    // remember to handle "X" or "*" for filled space (saved as PUZZLE_FILL_CHAR)
  };

  useEffect(() => {
    console.log("Board: Received puzzleData: ", puzzleData);
  }, []);

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
  const borderColor = "#35363866";
  const containerPadding = 4;
  const strokeWidth = 2;

  // maybe calculate this based on current screen width?
  const squareSize = 32;
  const borderRadius = 6;

  return (
    <div className="board-square">
      {/* Just out put string for now */}
      {/* {squareData} */}

      <svg
        height={squareSize + (2 * containerPadding)}
        width={squareSize + (2 * containerPadding)}
      >
        <rect
          height={squareSize}
          width={squareSize}
          rx={borderRadius}
          style={{
            fill: color,
            stroke: borderColor,
            strokeWidth: strokeWidth, 
          }}
          x={containerPadding}
          y={containerPadding}
        />
      </svg>
    </div>
  )
}
 
export default Board;
