import { createContext, useContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(false);

  return (
    <NavigationContext.Provider value={{ isNavigationDisabled, setIsNavigationDisabled }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Optional helper (if you want to keep useNavigation)
export const useNavigation = () => useContext(NavigationContext);
