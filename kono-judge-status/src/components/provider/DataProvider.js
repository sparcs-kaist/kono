import React, { createContext, useState, useContext, useEffect } from 'react';
import * as API from 'api';
import { useFetch } from 'lib/hooks'
import { WebsocketContext } from 'components/provider/WebsocketProvider';

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
        default:
            throw Error(`recent2millis: unsupported recent value ${recent}`);
    }
}

export const DataContext = createContext();

export default ({ children }) => {

    const { data } = useContext(WebsocketContext);
    const [cache, setCache] = useState({ data: {}, lastUpdated: Date.now() });

    const [
        deviceIDs,
        fetchDeviceIDs,
        isLoadingDeviceIDs,
        errorCodeDeviceIDs
    ] = useFetch([]);

    const [
        apiData,
        fetchAPIData,
        isLoadingAPIData,
        errorCodeAPIData
    ] = useFetch([]);

    const generateFilter = (cache) => (recent) => {
        const { data, lastUpdated } = cache;
        return Object.keys(data)
            .filter(timestamp => (timestamp + recent2millis(recent) >= lastUpdated))
            .reduce( (res, key) => (res[key] = data[key], res), {} );
    };

    const initialContext = {
        deviceIDs: [],
        isLoading: false,
        filter: generateFilter(cache)
    };

    const isLoading = isLoadingDeviceIDs || isLoadingAPIData;

    const [context, setContext] = useState(initialContext);

    useEffect(() => { setContext(prev => ({ ...prev, deviceIDs })); }, [deviceIDs])
    useEffect(() => { setContext(prev => ({ ...prev, isLoading })); }, [isLoading])

    useEffect(() => {
        fetchDeviceIDs(API.devices, []);
    }, [fetchDeviceIDs]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(data);
            const { timestamp, ...rest } = parsed;
            setCache(prev => {
                const { data: _data } = prev;
                return {
                    data: { ..._data, [timestamp]: rest },
                    lastUpdated: Date.now()
                };
            });
        } catch (e) { }
    }, [data]);

    useEffect(() => { setContext(prev => ({ ...prev, filter: generateFilter(cache) })) }, [cache]);

    return (
        <DataContext.Provider value={context}>
            { children }
        </DataContext.Provider>
    )

}