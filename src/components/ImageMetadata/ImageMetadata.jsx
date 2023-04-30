import React, { 
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  TbBinary,
} from "react-icons/tb";

import "./ImageMetadata.scss";

import Pane from '../Pane/Pane';
import TextInput from '../TextInput/TextInput';

const ImageMetadata = ({
  imageError,
  puzzleName, 
  puzzleData,
  puzzleGridString,
  puzzleGroup,
  setPuzzleName,
  setPuzzleGroup,
}) => {
  return ( 
    <Pane className="image-metadata">
      {
        puzzleData ? (
          <PuzzleData 
            puzzleData={puzzleData}
            puzzleGridString={puzzleGridString}
            puzzleGroup={puzzleGroup}
            puzzleName={puzzleName}
            setPuzzleGroup={setPuzzleGroup}
            setPuzzleName={setPuzzleName}
          />
        ) : (
          <NoPuzzleMessage />
        )
      }
    </Pane>
  );
}

function NoPuzzleMessage () {
  return (
    <div className="no-puzzle-message">
      <div className="no-puzzle-message-icon-wrapper">
        <TbBinary />
      </div>
      <p>
        Add an image on the left to display image data.
      </p>
    </div>
  )
}

function PuzzleData ({ 
  puzzleName,
  puzzleData,
  puzzleGridString,
  puzzleGroup,
  setPuzzleGroup,
  setPuzzleName,
}) {
  const { 
    colors,
    puzzle,
  } = puzzleData;

  return (
    <div className="puzzle-data">
      <h1>Puzzle Data</h1>
      <div className="puzzle-data-inputs">

        <TextInput
          key={"puzzle-name-text-input"}
          label={"Name"}
          setValue={setPuzzleName}
          value={puzzleName}
        />
        
        <TextInput
          key={"author-name-text-input"}
          label={"Group (optional)"}
          setValue={setPuzzleGroup}
          value={puzzleGroup}
        />
      </div>

      <ColorPalette
        colors={colors}
      />

      <ColorArrayDisplay
        puzzle={puzzle}
      />

      <PuzzleGridDisplay
        grid={puzzleGridString}
      />
    </div>
  );
}

function ColorPalette ({
  colors,
}) {
  return (
    <>
      {
        colors && Array.isArray(colors) && (
          <div className="color-palette">
            {
              colors.map((color) => (
                <div 
                  key={`color-${color}`}
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {color}
                </div>
              ))
            }
          </div>
        )
      }
    </>
  );
}

function ColorArrayDisplay ({
  puzzle,
}) {
  // TODO: Did I plan on expanding this in the future? 
  const parseColorArray = () => {
    return (
      <>
        {puzzle}
      </>
    )
  };

  return (
    <div className="color-array-display">
      <h2>Color Array</h2>
      {
        puzzle && parseColorArray()
      }
    </div>
  );
}

function PuzzleGridDisplay ({
  grid,
}) {
  // const [, updateState ] = useState();

  // // force redraw on grid change
  // useEffect(() => {
  //   console.log("Forcing Redraw?");
  //   updateState({});
  // }, [grid]);

  return (
    <div className="puzzle-grid-display">
      <h2>Puzzle Grid</h2>
      {
        grid
      }
    </div>
  )
}
 
export default ImageMetadata;