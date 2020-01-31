import React from 'react';
import { Selector } from 'components/common';

export default ({ 
    deviceIDs,
    selectedDeviceID, 
    setSelectedDeviceID
}) => {

    return (
        <div>
            <span>Available Devices:</span>
            <Selector
                elements={deviceIDs}
                selected={selectedDeviceID}
                setSelected={setSelectedDeviceID}
            />
        </div>
    )

}