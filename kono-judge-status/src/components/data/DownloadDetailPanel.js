import React, { useState } from 'react';
import styles from 'styles/components/DownloadDetailPanel.module.scss';
import { TIME_FILTERS, formatData } from 'lib/DataManaging';
import { MaterialIcon } from 'components/common';
import * as API from 'api';

const INPUT_NAME_DEVICE_ID = 'device_id';
const INPUT_NAME_FILTER    = 'recent';

const DOWNLOAD_FORMAT_CSV  = 'csv';
const DOWNLOAD_FORMAT_JSON = 'json';

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

function processDownloadFormat(data, downloadFormat) {
    switch (downloadFormat) {
        case DOWNLOAD_FORMAT_CSV:
            break;
        case DOWNLOAD_FORMAT_JSON:
            return new Blob([JSON.stringify(data)], { type: 'text/json' });
        default:
            throw Error(`DownloadDetailPanel: invalid format ${downloadFormat}`);
    }
}

export default ({ onEscape, deviceIDs }) => {

    const [selectedDeviceIDs, setSelectedDeviceIDs] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [errorString, setErrorString] = useState('');

    const onDownload = async (downloadFormat) => {

        if (selectedDeviceIDs.length === 0) {
            setErrorString('Select at least 1 device to download');
            return;
        }
        if (selectedFilter === null) {
            setErrorString('Time filter is not selected');
            return;
        }
        
        setErrorString('');
        const apiResults = await Promise.all(
            selectedDeviceIDs.map(
                deviceID => API.data(deviceID, selectedFilter)
                    .then(({ data }) => data)
            )
        );
        const downloadedData = selectedDeviceIDs.reduce(
            (prev, deviceID, idx) => {
                prev[deviceID] = apiResults[idx].map(rawData => formatData(rawData));
                return prev;
            }, {}
        );
        const blob = processDownloadFormat(downloadedData, downloadFormat);
        const url = window.URL.createObjectURL(blob);

        /* Create unseen a link to download file automatically. */
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href  = url;
        a.download = `${formatTime(Date.now())}.${downloadFormat}`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

    };

    const onChangeInput = (e) => {
        const { name, value, checked } = e.target;
        switch (name) {
            case INPUT_NAME_DEVICE_ID:
                if (checked)
                    setSelectedDeviceIDs(prev => [ ...prev, value ]);
                else
                    setSelectedDeviceIDs(prev => prev.filter(x => x !== value));
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
                <span className={styles.error}>{ errorString }</span>
                <div className={styles.button_wrapper}>
                    <div className={styles.button}
                        onClick={() => onDownload(DOWNLOAD_FORMAT_CSV)}>
                        CSV
                    </div>
                    <div className={styles.button}
                        onClick={() => onDownload(DOWNLOAD_FORMAT_JSON)}>
                        JSON
                    </div>
                </div>
            </div>
        </div>
    )

}