import React from 'react';

import { 
  TbFileCode, // maybe for save?
  TbFileDownload, // maybe for save?\
  TbLogin,
  TbReload,
} from "react-icons/tb";

import './Button.scss';

const Button = ({
  children,
  disabled,
  onClick,
  type = "none",
}) => {
  const buttonIcons = {
    "clear": (<TbReload />),
    "login": (<TbLogin />),
    // "save": (<TbFileCode />),
    "save": (<TbFileDownload />),
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
      disabled={disabled}
      className="app-button"
      onClick={onClick}
    >
      {getButtonIcon()}
      {children}
    </button>
  );
}
 
export default Button;