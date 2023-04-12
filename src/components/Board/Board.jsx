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
  gridViewActive,
  puzzleData = TEMP_PUZZLE_DATA,
  puzzleGrid,
  puzzleOpacity,
  togglePuzzleGridSquare,
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

  // TODO: Ultimately use this instead of getColorFromSquareData?
  const parseSquareData = (squareData) => {
    // squareData comes in as "pixelCount:colorIndex";
    const splitSquareData = squareData.split(":");
    
    return ({
      colorIndex: splitSquareData[1],
      color: colors[splitSquareData[1]],
      pixelCount: splitSquareData[0],
    });
  }

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
            gridViewActive={gridViewActive}
            key={`row-${index}`}
            parseSquareData={parseSquareData}
            puzzleGrid={puzzleGrid}
            puzzleOpacity={puzzleOpacity}
            rowData={rowData}
            togglePuzzleGridSquare={togglePuzzleGridSquare}
          />
        ))
      }
    </div>
  );
}

function Row ({ 
  colors,
  getColorFromSquareData,
  gridViewActive,
  parseSquareData,
  puzzleGrid,
  puzzleOpacity,
  rowData,
  togglePuzzleGridSquare,
}) {

  // this is assuming rowData is valid
  return (
    <div className="board-row">
      {
        rowData.map((squareData, index) => (
          <Square
            // color={getColorFromSquareData(squareData)}
            gridViewActive={gridViewActive}
            key={`square-${index}`}
            // isFilled={false}
            parseSquareData={parseSquareData}
            puzzleGrid={puzzleGrid}
            puzzleOpacity={puzzleOpacity}
            squareData={squareData}
            togglePuzzleGridSquare={togglePuzzleGridSquare}
          />
        ))
      }
    </div>
  );
}

function Square ({
  // color = "#FF0000", 
  gridViewActive,
  // isFilled,
  parseSquareData,
  puzzleGrid,
  puzzleOpacity = .75,
  squareData,
  togglePuzzleGridSquare,
}) {
  const { color, colorIndex, pixelCount } = (() => {
    console.log(`parsingSquareData for ${squareData}...`);
    const timeStarted = Date.now();
    const result = parseSquareData(squareData);
    const timeElapsed = Date.now() - timeStarted;
    console.log(`parsedSquareData in ${timeElapsed}`);
    return result;
  })();

  const borderColor = "#35363866";
  const containerPadding = 4;
  const emptyColor = "#FFFFFF";
  const fillColor = "#353638"
  const strokeWidth = 2;

  const isFilled = puzzleGrid[pixelCount] === 1;

  // maybe calculate this based on current screen width?
  const squareSize = 32;
  const borderRadius = 4;

  const toggleSquare = () => gridViewActive && togglePuzzleGridSquare(pixelCount);

  const getSquareColor = () => {
    if (!gridViewActive) {
      return color;
    }

    return isFilled ? fillColor : emptyColor;
  }

  const getPuzzleSquareColor = () => isFilled ? fillColor : emptyColor;

  const getPuzzleGridOpacity = () => gridViewActive ? puzzleOpacity : 0;

  return (
    <div 
      className="board-square"
      onClick={toggleSquare}
      // onMouseLeave={}
    >
      {/* Just out put string for now */}
      {/* {squareData} */}

      <svg
        height={squareSize + (2 * containerPadding)}
        width={squareSize + (2 * containerPadding)}
      >
        <rect
          className="board-square-rect color-rect"
          height={squareSize}
          width={squareSize}
          rx={borderRadius}
          style={{
            // fill: getSquareColor(),
            fill: color,
            stroke: borderColor,
            strokeWidth: strokeWidth, 
          }}
          x={containerPadding}
          y={containerPadding}
        />
        <rect
          className="board-square-rect puzzle-rect"
          height={squareSize}
          width={squareSize}
          rx={borderRadius}
          style={{
            fill: getPuzzleSquareColor(),
            opacity: getPuzzleGridOpacity(),
            // stroke: borderColor,
            // strokeWidth: strokeWidth, 
          }}
          x={containerPadding}
          y={containerPadding}
        />
      </svg>
    </div>
  )
}
 
export default Board;
