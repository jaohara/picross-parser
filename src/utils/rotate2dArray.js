export default function rotate2dArray(input) {
  // assumes a square, which is fine for our purposes
  const rows = input.length;
  const cols = input[0].length;

  const rotatedArray = [];

  for (let c = cols - 1; c >= 0; c--) {
    const newRow = [];

    for (let r = 0; r < rows; r++) {
      newRow.push(input[r][c]);
    }

    rotatedArray.push(newRow);
  }

  return rotatedArray;
}