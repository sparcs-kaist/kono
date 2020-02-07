import React, { useContext } from 'react';
import styles from 'styles/components/HistoryDetail.module.scss';
import { HistoryContext } from 'components/provider/HistoryProvider';
import classnames from 'lib/classnames';

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
    const filteredHistory = filterHistory(history, deviceID);

    return (
        <div className={styles.HistoryDetail}>
            <div className={styles.content}> 
                <div className={classnames([
                    styles.grid_item,
                    styles.grid_item_time
                ])}>Time</div>
                <div className={classnames([
                    styles.grid_item,
                    styles.grid_item_change
                ])}>Change</div> 
                {
                    filteredHistory.map(({ timestamp, change }) => {
                        return (
                            <>
                                <div className={classnames([
                                    styles.grid_item,
                                    styles.grid_item_time
                                ])}
                                    key={`grid-${timestamp}-time`}>
                                    { timestamp }
                                </div>
                                <div className={classnames([
                                    styles.grid_item,
                                    styles.grid_item_change
                                ])}
                                    key={`grid-${timestamp}-change`}>
                                    { change ? 'true' : 'false' }
                                </div>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )

}