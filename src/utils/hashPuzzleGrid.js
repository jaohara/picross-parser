import { createHash } from 'sha256-uint8array';

// creates the puzzle grid hash for checking/storing answers
export default function hashPuzzleGrid(puzzleGrid, puzzleName) {
  // puzzleGrid is the flat array of the current grid and puzzleName
  //  is the data stored at puzzleData.name

  const gridHashInput = `${puzzleName}${puzzleGrid}`;
  const gridHash = createHash().update(gridHashInput).digest("hex");
  return gridHash;
}