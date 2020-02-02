import React, { useState } from 'react';
import styles from 'styles/components/DownloadDetailPanel.module.scss';
import { TIME_FILTERS } from 'lib/DataManaging';
import { MaterialIcon } from 'components/common';

const INPUT_NAME_DEVICE_ID = 'device_id';
const INPUT_NAME_FILTER    = 'recent';

export default ({ onEscape, deviceIDs }) => {

    const [selectedDeviceID, setSelectedDeviceID] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);

    const onChangeInput = (e) => {
        const { name, value, checked } = e.target;
        switch (name) {
            case INPUT_NAME_DEVICE_ID:
                if (checked)
                    setSelectedDeviceID(value);
                else
                    setSelectedDeviceID(null);
                break;
            case INPUT_NAME_FILTER:
                setSelectedFilter(value);
                break;
            default:
                throw Error(`DownloadDetailPanel: invalid input name ${name}`);
        }
    };
    
    return (
        <div className={styles.DownloadDetailPanel}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>Download Data</div>
                    <div onClick={onEscape}>
                        <MaterialIcon 
                            fontSize={24}
                            style={{ cursor: 'pointer' }}
                        >
                            clear
                        </MaterialIcon>
                    </div>
                </div>
                <div className={styles.options}>
                    <div className={styles.column}>
                        <span className={styles.column_title}>Device IDs</span>
                        <div className={styles.column_content}>
                            {
                                deviceIDs.map(deviceID => {
                                    return (
                                        <div className={styles.column_item}
                                            key={`column_item_${deviceID}`}>
                                            <input 
                                                type="checkbox"
                                                name={INPUT_NAME_DEVICE_ID}
                                                value={deviceID} 
                                                onChange={onChangeInput} />
                                            <span>{ deviceID }</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.column}>
                        <span className={styles.column_title}>Filter</span>
                        <div className={styles.column_content}>
                            {
                                TIME_FILTERS.map(recent => {
                                    return (
                                        <div className={styles.column_item}
                                            key={`column_item_${recent}`}>
                                            <input 
                                                type="radio"
                                                name={INPUT_NAME_FILTER}
                                                value={recent} 
                                                onChange={onChangeInput} />
                                            <span>{ recent }</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.button_wrapper}>
                    <div className={styles.button}>Download</div>
                </div>
            </div>
        </div>
    )

}