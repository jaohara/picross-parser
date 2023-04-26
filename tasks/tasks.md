# TODO
- [ ] Make login form not close and give an error on an unrecogized user
- [ ] Ensure `updatePuzzle` function is working as intended
- [ ] Make a function to parse the `gridString` back into `puzzleGrid` on load
- [ ] Make a function to handle all aspects of loading
- [ ] Implement a way to load old puzzles when clicking an item in the `LoadPuzzlePanel` - `App.jsx` and `LoadPuzzlePanel.jsx`
- [ ] Work on basic `Board` click functionality - allow any click and drag to paint, worry about locking direction later

# Completed
- [x] Make Delete button in `LoadPuzzlesPanel` require 2 clicks to avoid accidental deletion - `LoadPuzzlesPanel.jsx`
- [x] Write function to sum up grid rows into numbers - `utils/new`
  - `0,1,1,0,1` becomes `2 1`
- [x] Use `rotate2dArray` and the above function to add row/col nums for actual count  - `App.jsx` 
- [x] Make sure puzzles are being saved with all relevant data
- [x] After puzzle is saved, make the `savedPuzzleId` state item is being properly set - `App.jsx`
- [x] Implement the `updatePuzzle` function - `api.js`
- [x] Use the `updatePuzzle` function when saving an existing puzzle - `ControlBar.jsx`