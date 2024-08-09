// navigation/NavigationContext.js
import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [onReturn, setOnReturn] = useState(null);

  return (
    <NavigationContext.Provider value={{ onReturn, setOnReturn }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => useContext(NavigationContext);
