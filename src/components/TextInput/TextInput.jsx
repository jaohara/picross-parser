import React from 'react';

import "./TextInput.scss";

const TextInput = ({
  error = false,
  label,
  password = false,
  setValue = () => {},
  value = "",
}) => {
  const getClassNames = () => `
    text-input
    ${error ? "error" : ""}
  `;

  return ( 
    <div className="text-input-wrapper">
      {
        label && (<label className="text-input-label">{label}</label>)
      }
      <input 
        className={getClassNames()}
        onChange={e => setValue(e.target.value)}
        type={password ? "password" : "text"}
        value={value}
      />
    </div>
  );
}
 
export default TextInput;