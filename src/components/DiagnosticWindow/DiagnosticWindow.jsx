import React from 'react';

import "./DiagnosticWindow.scss";

import Button from "../Button/Button";

const DiagnosticWindow = ({ 
  diagnosticWindowActive,
  logAuth = () => { console.log("logAuth called")},
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
        <div className="diagnostic-controls-wrapper">
          <Button 
            className="diagnostic-button"
            onClick={logAuth}
            type='log-auth'
          >
            Log Auth Object
          </Button>
        </div>
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
