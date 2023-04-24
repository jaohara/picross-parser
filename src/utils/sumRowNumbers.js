export default function sumRowNumbers(row) {
  // 0,1,1,0,1 becomes 2 1
  if (!Array.isArray(row) && row.length <= 0) {
    return null;
  }

  const result = [];
  let currentSum = 0;

  for (let i = 0; i < row.length; i++) {
    // console.log(`row[${i}] = ${row[i]}`)
    if (row[i] !== 0) {
      // console.log(`adding to current sum...`);
      currentSum++;
    }
    else {
      if (currentSum > 0) {
        result.push(currentSum);
        currentSum = 0;
      }
    }
  }

  if (currentSum > 0) {
    result.push(currentSum);
  }

  return result.length > 0 ? result : [0];
};


// test it out
function testSumRowNumbers() {
  let rows = [
    [1,1,1,1,1], // 5
    [0,0,0,0,0], // 0
    [1,1,0,1,1], // 2, 2
    [1,0,1,1,1], // 1,3
    [1,0,1,0,1], // 1,1,1
  ];
  
  rows.forEach((row) => {
    const rowSum = sumRowNumbers(row);
    console.log(`sumRowNumbers(${row}) = ${rowSum}`);
  });
}
