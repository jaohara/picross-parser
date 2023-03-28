import React from 'react';

import "./Pane.scss";


const Pane = ({ className, children }) => {
  /*
    This is a wrapper class the generic "container" that wraps items. It's 
    used in place of a div - it will provide some sort of common border/appearance 
    for the standard container elements.
  */

  return ( 
    <div className={`pane ${className}`}>
      {children}
    </div>
  );
}
 
export default Pane;