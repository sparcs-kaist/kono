import React, { useContext } from 'react';
import { DataContext } from 'components/provider/DataProvider';

export default () => {

    const { deviceIDs, filter } = useContext(DataContext);

    return (
        <div>
            { JSON.stringify(deviceIDs) }
            { JSON.stringify(filter(1277, '10sec')) }
        </div>
    )

}