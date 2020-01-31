import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from 'components/provider/DataProvider';
import { DeviceSelector } from 'components/data';

export default () => {

    const { deviceIDs } = useContext(DataContext);
    const [ selectedDeviceID, setSelectedDeviceID ] = useState(null);

    useEffect(() => console.log(`device selected: ${selectedDeviceID}`), [selectedDeviceID])

    return (
        <div>
            <DeviceSelector 
                deviceIDs={deviceIDs}
                selectedDeviceID={selectedDeviceID}
                setSelectedDeviceID={setSelectedDeviceID}/>
        </div>
    )

}