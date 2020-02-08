import React, { createContext, useState, useContext, useEffect } from 'react';
import * as API from 'api';
import { useFetch } from 'lib/hooks'
import { parseData, mergeData, processAPIData, generateFilter } from 'lib/DataManaging';
import { WebsocketContext } from 'components/provider/WebsocketProvider';

export const DataContext = createContext();

export default ({ children }) => {

    const { data } = useContext(WebsocketContext);
    const [cache, setCache] = useState({ data: {}, lastUpdated: Date.now() });

    const [
        deviceIDs,
        fetchDeviceIDs,
        isLoadingDeviceIDs,
        // errorCodeDeviceIDs
    ] = useFetch([]);

    const [
        apiData,
        fetchAPIData,
        isLoadingAPIData,
        // errorCodeAPIData
    ] = useFetch([]);

    const updateCache = (newData) => {
        setCache(prevCache => {
            const { data: oldData } = prevCache;
            return {
                data: mergeData(oldData, newData),
                lastUpdated: Date.now()
            };
        });
    };

    const initialContext = {
        deviceIDs: [],
        isLoading: false,
        filter: generateFilter(cache),
        fetch: (deviceID, recent) => fetchAPIData(API.data, [deviceID, recent])
    };

    const isLoading = isLoadingDeviceIDs || isLoadingAPIData;

    const [context, setContext] = useState(initialContext);

    /* Context updater for deviceIDs and isLoading */
    useEffect(() => { setContext(prev => ({ ...prev, deviceIDs })); }, [deviceIDs])
    useEffect(() => { setContext(prev => ({ ...prev, isLoading })); }, [isLoading])

    /* Context updater for WebSocket update */
    useEffect(() => {
        try {
            if (data) {
                updateCache(parseData(data));
            }
        } catch (e) { }
    }, [data]);

    /* Context updater for API update */
    useEffect(() => {
        if (apiData) {
            const newData = processAPIData(apiData);
            updateCache(newData);
        }
    }, [apiData]);

    /* Update cache for subscribers */
    useEffect(() => { setContext(prev => ({ ...prev, filter: generateFilter(cache) })) }, [cache]);

    /* Fetch device ID list at first render */
    useEffect(() => {
        fetchDeviceIDs(API.devices, [], deviceIDs => deviceIDs.map(id => Number(id)));
    }, [fetchDeviceIDs]);

    return (
        <DataContext.Provider value={context}>
            { children }
        </DataContext.Provider>
    )

}