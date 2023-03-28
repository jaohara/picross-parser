import React from 'react';

const Button = ({
  children,
  onClick,
  type = "none",
}) => {
  const buttonIcons = {
    "save": "REPLACEME",
  };

  return (
    <button className="app-button">
      {children}
    </button>
  );
}
 
export default Button;