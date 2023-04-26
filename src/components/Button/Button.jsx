import React from 'react';

import { 
  TbCloudDownload,
  TbCloudUpload,
  TbFileCode, // maybe for save?
  TbFileDownload, // maybe for save?
  TbLoader,
  TbLogin,
  TbLogout,
  TbPuzzle,
  TbPuzzleOff,
  TbReload,
  TbStethoscope,
  TbStethoscopeOff,
  TbTrash, // maybe for delete?
  TbTrashX,
  TbUserCircle,
  TbUserPlus,
} from "react-icons/tb";

import './Button.scss';

const Button = ({
  children,
  className,
  disabled,
  isFormSubmit = false,
  onClick,
  onMouseOut = () => {},
  type = "none",
}) => {
  const buttonIcons = {
    "clear": (<TbReload />),
    "delete": (<TbTrashX />),
    "diagnostic-on": (<TbStethoscope />), 
    "diagnostic-off": (<TbStethoscopeOff />), 
    "log-auth": (<TbUserCircle />),
    "load": (<TbCloudDownload />),
    "login": (<TbLogin />),
    "logout": (<TbLogout />),
    // "save": (<TbFileCode />),
    // "save": (<TbFileDownload />),
    "save": (<TbCloudUpload />),
    "signup": (<TbUserPlus />),
    "puzzle-off": (<TbPuzzleOff />),
    "puzzle-on": (<TbPuzzle />),
    "waiting": (<TbLoader />)
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
          ${type === "waiting" ? "waiting" : ""}
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
      onMouseOut={onMouseOut}
      type={isFormSubmit ? "submit" : "button"}
    >
      {getButtonIcon()}
      {children}
    </button>
  );
}
 
export default Button;