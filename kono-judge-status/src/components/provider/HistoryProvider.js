import React, { createContext, useEffect, useState } from 'react';

export const HistoryContext = createContext();

export default ({ children }) => {

    const [history, setHistory] = useState({});

    const push = (newState, timestamp, deviceID, change) => {
        setHistory(prev => ({ ...prev, [timestamp]: {
            state: newState,
            timestamp,
            deviceID,
            change
        } }));
    };

    const erase = (timestamp) => {
        setHistory(({ [timestamp]: drop, ...rest }) => rest);
    }

    const initialContext = { history, push, erase };
    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prev => ({ ...prev, history })) }, [history]);

    return (
        <HistoryContext.Provider value={context}>
            { children }
        </HistoryContext.Provider>
    )

}