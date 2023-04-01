import React from 'react';

import {
  TbBinary,
} from "react-icons/tb";

import "./ImageMetadata.scss";

import Pane from '../Pane/Pane';
import TextInput from '../TextInput/TextInput';

const ImageMetadata = ({
  author,
  imageError,
  name, 
  puzzleData,
  setAuthor,
  setName,
}) => {
  return ( 
    <Pane className="image-metadata">
      {
        puzzleData ? (
          <PuzzleData 
            author={author}
            name={name}
            puzzleData={puzzleData} 
            setAuthor={setAuthor}
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
  author,
  puzzleData,
  name,
  setAuthor,
  setName,
}) {
  const { colors, puzzle } = puzzleData;

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
        
        <TextInput
          key={"author-name-text-input"}
          label={"Made By"}
          setValue={setAuthor}
          value={author}
        />
      </div>

      <ColorPalette
        colors={colors}
      />

      <PuzzleArrayDisplay
        puzzle={puzzle}
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

function PuzzleArrayDisplay ({
  puzzle,
}) {
  const parsePuzzleArray = () => {
    return (
      <>
        {puzzle}
      </>
    )
  };

  return (
    <div className="puzzle-array-display">
      {
        puzzle && parsePuzzleArray()
      }
    </div>
  );
}
 
export default ImageMetadata;