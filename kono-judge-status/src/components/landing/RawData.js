import React, { useContext, useEffect } from 'react';
import { DataContext } from 'components/provider/DataProvider';

export default () => {

    const { deviceIDs, filter, fetch } = useContext(DataContext);

    useEffect(() => { fetch(1277, '10sec'); }, []);

    return (
        <div>
            { JSON.stringify(deviceIDs) }
            { JSON.stringify(filter('10sec')) }
        </div>
    )

}