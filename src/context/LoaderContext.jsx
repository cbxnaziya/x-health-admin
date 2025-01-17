// LoaderContext.js
import { createContext, useContext, useState } from 'react';

// Create Loader Context
const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoader: setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Custom hook to use loader state
export const useLoader = () => useContext(LoaderContext);
