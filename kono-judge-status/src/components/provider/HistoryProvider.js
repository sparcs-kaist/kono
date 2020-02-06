import React, { createContext, useEffect, useState } from 'react';

export const HistoryContext = createContext();

export default ({ children }) => {

    const [history, setHistory] = useState({});

    const initialContext = { history, setHistory };
    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prev => ({ ...prev, history })) }, [history]);

    return (
        <HistoryContext.Provider value={context}>
            { children }
        </HistoryContext.Provider>
    )

}