import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from 'components/provider/DataProvider';
import { DeviceSelector, FilterSelector } from 'components/data';
import { TIME_FILTERS } from 'components/provider/DataProvider';

export default () => {

    const { deviceIDs } = useContext(DataContext);
    const [ selectedDeviceID, setSelectedDeviceID ] = useState(null);
    const [ selectedFilter, setSelectedFilter ] = useState(TIME_FILTERS[0]);

    useEffect(() => console.log(`device selected: ${selectedDeviceID}`), [selectedDeviceID])
    useEffect(() => console.log(`filter selected: ${selectedFilter}`), [selectedFilter])

    return (
        <div>
            <DeviceSelector 
                deviceIDs={deviceIDs}
                selectedDeviceID={selectedDeviceID}
                setSelectedDeviceID={setSelectedDeviceID}/>
            <FilterSelector
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}/>
        </div>
    )

}