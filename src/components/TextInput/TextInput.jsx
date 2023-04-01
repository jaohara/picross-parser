import React from 'react';

import "./TextInput.scss";

const TextInput = ({
  label,
  setValue = () => {},
  value = "",
}) => {
  return ( 
    <div className="text-input-wrapper">
      {
        label && (<label className="text-input-label">{label}</label>)
      }
      <input 
        className='text-input'
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
}
 
export default TextInput;