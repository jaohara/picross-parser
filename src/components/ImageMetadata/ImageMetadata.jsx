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
  name, 
  puzzleData,
  puzzleGridString,
  setName,
}) => {
  return ( 
    <Pane className="image-metadata">
      {
        puzzleData ? (
          <PuzzleData 
            name={name}
            puzzleData={puzzleData}
            puzzleGridString={puzzleGridString}
            setName={setName}
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
  name,
  puzzleData,
  puzzleGridString,
  setName,
}) {
  const { 
    colors,
    // grid, 
    puzzle,
  } = puzzleData;

  return (
    <div className="puzzle-data">
      <h1>Puzzle Data</h1>
      {/* <strong>puzzleData</strong>:{ }{JSON.stringify(puzzleData)} */}
      <div className="puzzle-data-inputs">


        {/* 
        
          TODO: These need to be optimized - right now, when the value 
          changes, it causes the Board child of App to also be redrawn.

          How do I fix this? What if I had the value managed by the text input itself,
          and then submitted when it loses focus? 
            - What happens if this never fires, such as when a user clicks the
              "Save Image" button without blurring the TextInput?
            - 

        */}
        <TextInput
          key={"puzzle-name-text-input"}
          label={"Name"}
          setValue={setName}
          value={name}
        />
        
        {/* <TextInput
          key={"author-name-text-input"}
          label={"Made By"}
          setValue={setAuthor}
          value={author}
        /> */}
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