import React, { useContext } from 'react';
import { DataContext } from 'components/provider/DataProvider';

export default () => {

    const {
        data, 
        deviceIDs, 
        isLoading
    } = useContext(DataContext);

    return (
        <div>
            <div>{ JSON.stringify(data) }</div>
            <div>{ JSON.stringify(deviceIDs) }</div>
            <div>{ isLoading }</div>
        </div>
    )

}