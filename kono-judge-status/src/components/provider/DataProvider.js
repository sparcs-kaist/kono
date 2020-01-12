import React, { createContext, useState, useContext, useEffect } from 'react';
import * as API from 'api';
import { useFetch } from 'lib/hooks'
import { WebsocketContext } from 'components/provider/WebsocketProvider';
import * as WEBSOCKET_CONSTANTS from 'lib/websocket/constants';

function recent2millis(recent) {
    switch (recent) {
        case '10sec':
            return 10 * 1000;
        case '1min':
            return 60 * 1000;
        case '10min':
            return 10 * 60 * 1000;
        case '1h':
            return 60 * 60 * 1000;
        case '6h':
            return 6 * 60 * 60 * 1000;
        case '24h':
            return 24 * 60 * 60 * 1000;
    }
}

export const DataContext = createContext();

export default ({ children }) => {

    const { state, data } = useContext(WebsocketContext);
    const cache = [];

    const [
        deviceIDs,
        fetchDeviceIDs,
        isLoadingDeviceIDs,
        errorCodeDeviceIDs
    ] = useFetch([]);

    const filter = (recent) => {
        return cache.filter(({ timestamp }) => {
            return timestamp + recent2millis(recent) >= Date.now();
        });
    };

    const initialContext = {
        state: WEBSOCKET_CONSTANTS.STATE_CLOSED,
        deviceIDs: [],
        isLoading: false,
        filter
    };

    const isLoading = isLoadingDeviceIDs;

    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prevState => ({ ...prevState, state })); }, [state]);
    useEffect(() => { setContext(prevState => ({ ...prevState, deviceIDs })); }, [deviceIDs])
    useEffect(() => { setContext(prevState => ({ ...prevState, isLoading })); }, [isLoading])

    useEffect(() => {
        fetchDeviceIDs(API.devices, []);
    }, [fetchDeviceIDs]);

    return (
        <DataContext.Provider value={context}>
            { children }
        </DataContext.Provider>
    )

}