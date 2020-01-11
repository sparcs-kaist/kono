import React, { useEffect, useState } from 'react';
import * as API from 'api';
import { useFetch } from 'lib/hooks'

export default () => {

    const [
        data,
        fetchData,
        isLoadingData,
        errorCodeData
    ] = useFetch([]);

    const [
        deviceIDs,
        fetchDeviceIDs,
        isLoadingDeviceIDs,
        errorCodeDeviceIDs
    ] = useFetch([]);

    const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());
    const lastUpdatedTimeString = new Date(lastUpdatedTime).toLocaleString()

    useEffect(() => {
        fetchData(API.data, [2124, '10sec']);
        fetchDeviceIDs(API.devices, []);
        setLastUpdatedTime(Date.now());
    }, [fetchData, fetchDeviceIDs]);

    return (
        <div>
            <h3>RawVisualizer</h3>
            <div>
                { lastUpdatedTimeString }
            </div>
            <div>
                { errorCodeData }
            </div>
            <div>
                { errorCodeDeviceIDs }
            </div>
            {
                !isLoadingData && (
                    <div>
                        { data }
                    </div>
                )
            }
            {
                !isLoadingDeviceIDs && (
                    <div>
                        { deviceIDs }
                    </div>
                )
            }
        </div>
    )

};