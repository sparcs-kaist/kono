import React from 'react';
import styles from 'styles/components/DownloadDetailPanel.module.scss';
import { TIME_FILTERS } from 'lib/DataManaging';
import { MaterialIcon } from 'components/common';

export default ({ onEscape, deviceIDs }) => {

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
                                                name="device_id"
                                                value={deviceID} />
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
                                                name="recent"
                                                value={recent} />
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