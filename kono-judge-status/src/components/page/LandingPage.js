import React, { useState, useContext, useEffect } from 'react';
import styles from 'styles/components/LandingPage.module.scss';
import { WebsocketController } from 'components/websocket';
import { FilterSelector, DeviceSelector, DataPanel } from 'components/data';
import { TIME_FILTERS, DataContext } from 'components/provider/DataProvider';
import classnames from 'lib/classnames';

export default () => {

    const { deviceIDs, fetch, isLoading } = useContext(DataContext);
    const [selectedDeviceID, setSelectedDeviceID] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(TIME_FILTERS[0]);

    useEffect(() => {
        if (selectedDeviceID !== null) {
            fetch(selectedDeviceID, selectedFilter);
        }
    }, [fetch, selectedDeviceID, selectedFilter]);

    return (
        <div className={styles.LandingPage}>
            <div className={styles.content}>
                <DataPanel 
                    isLoading={isLoading}
                    selectedDeviceID={selectedDeviceID}
                    selectedFilter={selectedFilter}
                />
            </div>
            <div className={styles.sidebar}>
                <div className={styles.sidebar_item}>
                    <WebsocketController />
                </div>
                <div className={classnames([
                    styles.sidebar_item,
                    styles.sidebar_item_stretch
                ])}>
                    <DeviceSelector 
                        deviceIDs={deviceIDs}
                        selectedDeviceID={selectedDeviceID}
                        setSelectedDeviceID={setSelectedDeviceID}
                    />
                </div>
                <div className={styles.sidebar_item}>
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