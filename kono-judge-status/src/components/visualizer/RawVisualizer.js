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

    const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());
    const lastUpdatedTimeString = new Date(lastUpdatedTime).toLocaleString()

    useEffect(() => {
        fetchData(API.data, [2124, '10sec']);
        setLastUpdatedTime(Date.now());
    }, [fetchData]);

    return (
        <div>
            <h3>RawVisualizer</h3>
            <div>
                { lastUpdatedTimeString }
            </div>
            <div>
                { errorCodeData }
            </div>
            {
                isLoadingData && (
                    <div>
                        { data }
                    </div>
                )
            }
        </div>
    )

};