import React, { createContext, useState, useContext } from "react";

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  // ADD THIS LINE: This will hold your CSV file in memory!
  const [currentFile, setCurrentFile] = useState(null); 

  return (
    <AnalysisContext.Provider value={{ analysisResult, setAnalysisResult, currentFile, setCurrentFile }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);