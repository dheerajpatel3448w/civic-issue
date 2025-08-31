/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */

import { useState, createContext } from "react";

export const OfficerContext = createContext();

export const OfficerContextProvider = ({children}) => {
    const [officer, setofficer] = useState(null);
    return (
        <OfficerContext.Provider value={{ officer, setofficer }}>
            {children}
        </OfficerContext.Provider>
    )}