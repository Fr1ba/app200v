import { createContext, useState } from 'react';

// Create the context
export const CaseContext = createContext();

// Create a provider component
export const CaseProvider = ({ children }) => {
    const [caseId, setCaseId] = useState(null);

    return (
        <CaseContext.Provider value={{ caseId, setCaseId }}>
            {children}
        </CaseContext.Provider>
    );
};