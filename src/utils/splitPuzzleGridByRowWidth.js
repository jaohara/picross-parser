export default function splitPuzzleGridByRowWidth (puzzleGrid, rowWidth) {
  const result = [];
  let currentRowArray;

  const checkAndAddCurrentRowArray = () => 
    Array.isArray(currentRowArray) && result.push(currentRowArray);

  for (let i = 0; i < puzzleGrid.length; i++) {
    const currentItem = puzzleGrid[i];

    if (i % rowWidth === 0) {
      checkAndAddCurrentRowArray();
      currentRowArray = [];
    }

    currentRowArray.push(currentItem)
  }

  checkAndAddCurrentRowArray();

  return result;
}

function testSplitPuzzleGridByRowWidth() {
  // const testArray = Array.from(Array(25 + 1).keys()).slice(1);
  // const testArray = Array.from(Array(100 + 1).keys()).slice(1);
  const testArray = Array.from(Array(225 + 1).keys()).slice(1);
  // const testRowWidth = 5;
  // const testRowWidth = 10;
  const testRowWidth = 15;
  const result = splitPuzzleGridByRowWidth(testArray, testRowWidth);

  console.log(`input: `, testArray);
  console.log(`result: `, result);
};

// testSplitPuzzleGridByRowWidth();