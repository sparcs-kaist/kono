import React, { createContext, useEffect, useState } from 'react';

export const HistoryContext = createContext();

export function filterHistory(history, deviceID) {
    const filtered = [];
    for (var timestamp in history) {
        const { deviceID: _deviceID, change } = history[timestamp];
        if (deviceID === _deviceID)
            filtered.push({ timestamp, change });
    }
    return filtered;
}

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

    const initialContext = { history, push };
    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prev => ({ ...prev, history })) }, [history]);

    return (
        <HistoryContext.Provider value={context}>
            { children }
        </HistoryContext.Provider>
    )

}