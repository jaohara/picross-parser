import React from 'react';

import { 
  TbReload,
} from "react-icons/tb";

import './Button.scss';

const Button = ({
  children,
  onClick,
  type = "none",
}) => {
  const buttonIcons = {
    "save": "REPLACEME",
    "clear": (<TbReload />)
  };

  const availableIcons = Object.keys(buttonIcons);

  const getButtonIcon = () => {
    if (!availableIcons.includes(type)) {
      return;
    }

    return (
      <div className="button-icon-wrapper">
        {buttonIcons[type]}
      </div>
    );
  };

  return (
    <button 
      className="app-button"
      onClick={onClick}
    >
      {getButtonIcon()}
      {children}
    </button>
  );
}
 
export default Button;