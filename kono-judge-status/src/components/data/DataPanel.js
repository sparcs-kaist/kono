import React, { useContext, useState } from 'react';
import { DataContext } from 'components/provider/DataProvider';
import { DeviceSelector } from 'components/data';

export default () => {

    const { deviceIDs } = useContext(DataContext);
    const [ selectedDeviceID, setSelectedDeviceID ] = useState(null);

    return (
        <div>
            { JSON.stringify(deviceIDs) }
            <DeviceSelector 
                deviceIDs={deviceIDs}
                selectedDeviceID={selectedDeviceID}
                setSelectedDeviceID={setSelectedDeviceID}/>
        </div>
    )

}