import React from 'react';
import styles from 'styles/components/DeviceSelector.module.scss';
import { Selector } from 'components/common';

export default ({ 
    deviceIDs,
    selectedDeviceID, 
    setSelectedDeviceID
}) => {

    return (
        <div className={styles.DeviceSelector}>
            <div className={styles.content_wrapper}>
                <span>Available Devices:</span>
                <Selector
                    elements={deviceIDs}
                    selected={selectedDeviceID}
                    setSelected={setSelectedDeviceID}
                    theme="cyan"
                />
            </div>
        </div>
    )

}