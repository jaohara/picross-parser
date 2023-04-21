import React from 'react';

import "./TextInput.scss";

const TextInput = ({
  error = false,
  label,
  onChange,
  password = false,
  setValue = () => {},
  value = "",
}) => {
  const getClassNames = () => `
    text-input
    ${error ? "error" : ""}
  `;

  const handleInput = (e) => {
    setValue(e.target.value);

    if (onChange && typeof onChange === "function") {
      onChange(e);
    }
  }

  return ( 
    <div className="text-input-wrapper">
      {
        label && (<label className="text-input-label">{label}</label>)
      }
      <input 
        className={getClassNames()}
        // onChange={e => setValue(e.target.value)}
        onChange={e => handleInput(e)}
        type={password ? "password" : "text"}
        value={value}
      />
    </div>
  );
}
 
export default TextInput;