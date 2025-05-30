import { createContext, useState } from "react";

export const CaseContext = createContext();

/**
 * CaseProvider Component
 *
 * Provides the CaseContext to its child components, allowing them to access and modify
 * the selected case's ID and subject.
 * @component
 * @name SelectedCase
 * @returns {JSX.Element} JSX element representing the CaseProvider component
 * @author Michal
 */
export const CaseProvider = ({ children }) => {
  const [caseId, setCaseId] = useState(null);
  const [caseSubject, setCaseSubject] = useState("");

  return (
    <CaseContext.Provider
      value={{ caseId, setCaseId, caseSubject, setCaseSubject }}
    >
      {children}
    </CaseContext.Provider>
  );
};
