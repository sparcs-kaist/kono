import React, { useContext } from 'react';
import styles from 'styles/components/HistoryDetail.module.scss';
import { HistoryContext } from 'components/provider/HistoryProvider';

function filterHistory(history, deviceID) {
    const filtered = [];
    for (var timestamp in history) {
        const { deviceID: _deviceID, change } = history[timestamp];
        if (deviceID === _deviceID)
            filtered.push({ timestamp, change });
    }
    return filtered;
}

export default ({ deviceID }) => {

    if (deviceID === null)
        return null;

    const { history } = useContext(HistoryContext);

    return (
        <div className={styles.HistoryDetail}>
            <div className={styles.content}>  
                { JSON.stringify(filterHistory(history, deviceID)) }
            </div>
        </div>
    )

}