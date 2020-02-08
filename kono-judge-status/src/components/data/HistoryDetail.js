import React, { useContext, Fragment } from 'react';
import styles from 'styles/components/HistoryDetail.module.scss';
import { HistoryContext } from 'components/provider/HistoryProvider';
import classnames from 'lib/classnames';
import MaterialIcon from 'components/common/MaterialIcon';

function filterHistory(history, deviceID) {
    const filtered = [];
    for (var timestamp in history) {
        const { deviceID: _deviceID, change } = history[timestamp];
        if (deviceID === _deviceID)
            filtered.push({ timestamp, change });
    }
    return filtered;
}

function timestampToString(timestamp) {
    const date = new Date(Number(timestamp));
    const to2digits = (x) => (x >= 10 ? x : '0' + x);
    return `${to2digits(date.getHours())}:${to2digits(date.getMinutes())}`;
}

function changeToString(change) {
    if (change === undefined)
        return 'No Info';
    else if (change === true)
        return 'Occupied';
    else if (change === false)
        return 'Vacant';
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
                    filteredHistory.map(({ timestamp, change }, idx) => {
                        const coloredItem = (idx % 2) == 0;
                        return (
                            <Fragment key={`grid-${timestamp}`}>
                                <div className={classnames([
                                    styles.grid_item,
                                    coloredItem && styles.grid_item_colored,
                                    styles.grid_item_time
                                ])}
                                    key={`grid-${timestamp}-time`}>
                                    <span>
                                        { timestampToString(timestamp) }
                                    </span>
                                </div>
                                <div className={classnames([
                                    styles.grid_item,
                                    coloredItem && styles.grid_item_colored,
                                    styles.grid_item_change
                                ])}
                                    key={`grid-${timestamp}-change`}>
                                    <span>
                                        { changeToString(change) }
                                    </span>
                                </div>
                                <div className={classnames([
                                    styles.grid_item,
                                    coloredItem && styles.grid_item_colored,
                                    styles.grid_item_delete
                                ])}
                                    key={`grid-${timestamp}-delete`}>
                                    <MaterialIcon fontSize={14}>delete</MaterialIcon>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
        </div>
    )

}