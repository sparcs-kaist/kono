import React, { useState, useContext } from 'react';
import { WebsocketController } from 'components/websocket';
import { FilterSelector, DeviceSelector } from 'components/data';
import { TIME_FILTERS, DataContext } from 'components/provider/DataProvider';

export default () => {

    const { deviceIDs } = useContext(DataContext);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(TIME_FILTERS[0]);

    return (
        <div>
            <div>
                Data
            </div>
            <div>
                <div>
                    <WebsocketController />
                </div>
                <div>
                    <DeviceSelector 
                        deviceIDs={deviceIDs}
                        selectedDevice={selectedDevice}
                        setSelectedDevice={setSelectedDevice}
                    />
                </div>
                <div>
                    <FilterSelector 
                        filters={TIME_FILTERS}
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />
                </div>
            </div>
        </div>
    );
    
};