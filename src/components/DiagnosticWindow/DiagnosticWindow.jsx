import React from 'react';

import "./DiagnosticWindow.scss";

import Button from "../Button/Button";

const DiagnosticWindow = ({ 
  diagnosticWindowActive,
  setDiagnosticWindowActive 
}) => {
  const getClassNames = () => `
    diagnostic-window
    ${diagnosticWindowActive ? "active" : ""}
  `;

  return ( 
    <div className={getClassNames()}>
      <div className="diagnostic-window-button-wrapper">
        <DiagnosticWindowButton
          diagnosticWindowActive={diagnosticWindowActive}
          setDiagnosticWindowActive={setDiagnosticWindowActive}
        />
      </div>

      <div className="diagnostic-window-content">
        <p>Hey, I&apos;m the diagnostic window!</p>
      </div>
    </div>
  );
};

const DiagnosticWindowButton = ({ 
  diagnosticWindowActive,
  setDiagnosticWindowActive,
}) => {
  const getButtonType = () => diagnosticWindowActive ? "diagnostic-off" : "diagnostic-on";

  const toggleDiagnosticWindow = () => setDiagnosticWindowActive(!diagnosticWindowActive);

  return (
    <Button 
      className="diagnostic-window-button"
      onClick={toggleDiagnosticWindow}
      type={getButtonType()}
    />
  );
};
 
export default DiagnosticWindow
