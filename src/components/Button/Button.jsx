import React from 'react';

import { 
  TbFileCode, // maybe for save?
  TbFileDownload, // maybe for save?\
  TbLogin,
  TbPuzzle,
  TbPuzzleOff,
  TbReload,
  TbStethoscope,
  TbStethoscopeOff,
} from "react-icons/tb";

import './Button.scss';

const Button = ({
  children,
  className,
  disabled,
  onClick,
  type = "none",
}) => {
  const buttonIcons = {
    "clear": (<TbReload />),
    "diagnostic-on": (<TbStethoscope />), 
    "diagnostic-off": (<TbStethoscopeOff />), 
    "login": (<TbLogin />),
    // "save": (<TbFileCode />),
    "save": (<TbFileDownload />),
    "puzzle-off": (<TbPuzzleOff />),
    "puzzle-on": (<TbPuzzle />),
  };

  const availableIcons = Object.keys(buttonIcons);

  const getButtonIcon = () => {
    if (!availableIcons.includes(type)) {
      return;
    }

    return (
      <div 
        className={`
          button-icon-wrapper
          ${!children ? "no-margin" : ""}
      `}>
        {buttonIcons[type]}
      </div>
    );
  };

  return (
    <button 
      disabled={disabled}
      className={`${className} app-button`}
      onClick={onClick}
    >
      {getButtonIcon()}
      {children}
    </button>
  );
}
 
export default Button;