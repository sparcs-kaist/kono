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

function filterData(data, lastUpdated, deviceID, recent) {
    if (!data[deviceID])
        return {};
    return Object.keys(data[deviceID])
        .filter(timestampStr => {
            const timestamp = Number(timestampStr);
            return timestamp + recent2millis(recent) >= lastUpdated;
        })
        .reduce((obj, timestamp) => {
            obj[timestamp] = data[deviceID][timestamp];
            return obj;
        }, {});
}

function mergeData(data1, data2) {
    const deviceIDs = [...Object.keys(data1), ...Object.keys(data2)];
    return deviceIDs.reduce(
        (obj, deviceID) => {
            obj[deviceID] = { ...data1[deviceID], ...data2[deviceID] };
            return obj;
        }, {}
    );
}

function processAPIData(apiData) {
    return apiData.reduce(
        (obj, { timestamp, device_id: deviceID, ...rest }) => {
            if (!obj[deviceID])
                obj[deviceID] = {};
            obj[deviceID][timestamp] = rest;
            return obj;
        }, {}
    );
}

function generateFilter({ data, lastUpdated }) {
    return (deviceID, recent) => filterData(data, lastUpdated, deviceID, recent);
};

export const DataContext = createContext();
export const TIME_FILTERS = ['10sec', '1min', '10min', '1h', '6h', '24h'];

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
                const parsed = JSON.parse(data);
                const { device_id: deviceID, timestamp, ...rest } = parsed;
                const newData = { [deviceID]: { [timestamp]: rest } };
                updateCache(newData);
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
        fetchDeviceIDs(API.devices, []);
    }, [fetchDeviceIDs]);

    return (
        <DataContext.Provider value={context}>
            { children }
        </DataContext.Provider>
    )

}