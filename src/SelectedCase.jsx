// SelectedCase.jsx
import { createContext, useState } from 'react';

export const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
    const [caseId, setCaseId] = useState(null);
    const [caseSubject, setCaseSubject] = useState("");

    return (
        <CaseContext.Provider value={{ caseId, setCaseId, caseSubject, setCaseSubject }}>
            {children}
        </CaseContext.Provider>
    );
};
