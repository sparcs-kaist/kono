import React, { useState, useContext, useEffect } from 'react';
import styles from 'styles/components/LandingPage.module.scss';
import classnames from 'lib/classnames';
import { TIME_FILTERS } from 'lib/DataManaging';
import { Hover } from 'components/common';
import { WebsocketController } from 'components/websocket';
import { 
    FilterSelector, DeviceSelector, HistoryEditor,
    DataPanel, DownloadPanel, DownloadDetailPanel
} from 'components/data';
import { DataContext } from 'components/provider/DataProvider';

export default () => {

    const { deviceIDs, fetch, isLoading } = useContext(DataContext);
    const [selectedDeviceID, setSelectedDeviceID] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(TIME_FILTERS[0]);
    const [showHover, setShowHover] = useState(false);

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
                <div className={classnames([
                    styles.sidebar_item,
                    styles.sidebar_item_stretch
                ])}>
                    <HistoryEditor
                        deviceIDs={deviceIDs} />
                </div>
                <div className={styles.sidebar_item}>
                    <FilterSelector 
                        filters={TIME_FILTERS}
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />
                </div>
                <div className={styles.sidebar_item}>
                    <DownloadPanel
                        onClickDownload={() => setShowHover(true)}
                    />
                </div>
            </div>
            {
                showHover && <Hover>
                    <DownloadDetailPanel 
                        onEscape={() => setShowHover(false)}
                        deviceIDs={deviceIDs}
                    />
                </Hover>
            }
        </div>
    );
    
};