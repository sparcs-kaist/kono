import React, { createContext, useEffect, useState } from 'react';

export const HistoryContext = createContext();

export default ({ children }) => {

    const [history, setHistory] = useState({});

    const push = (deviceID, timestamp, newValue) => {
        setHistory(prev => {
            const prevList = prev[deviceID] || [];
            return {
                ...prev,
                [deviceID]: [ ...prevList, [timestamp, newValue] ]
            };
        });
    }

    const initialContext = { history, push };
    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prev => ({ ...prev, history })) }, [history]);

    return (
        <HistoryContext.Provider value={context}>
            { children }
        </HistoryContext.Provider>
    )

}