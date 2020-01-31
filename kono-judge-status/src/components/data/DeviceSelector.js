import React from 'react';
import { Selector } from 'components/common';

export default ({ 
    deviceIDs,
    selectedDeviceID, 
    setSelectedDeviceID
}) => {

    return (
        <div>
            DeviceSelector
            <span>{ selectedDeviceID }</span>
        </div>
    )

}