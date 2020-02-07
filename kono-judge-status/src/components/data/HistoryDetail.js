import React, { useContext } from 'react';
import styles from 'styles/components/HistoryDetail.module.scss';
import { HistoryContext } from 'components/provider/HistoryProvider';

function filterHistory(history, deviceID) {

}

export default ({ deviceID }) => {

    if (deviceID === null)
        return null;

    const { history } = useContext(HistoryContext);

    return (
        <div className={styles.HistoryDetail}>
            { deviceID }
        </div>
    )

}