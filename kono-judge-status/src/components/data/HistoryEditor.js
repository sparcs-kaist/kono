import React from 'react';
import styles from 'styles/components/HistoryEditor.module.scss';
import classnames from 'lib/classnames';

export default ({ deviceIDs }) => {

    return (
        <div className={styles.HistoryEditor}>
            <div className={styles.content_wrapper}>
                <span className={styles.title}>State Editor</span>
                {
                    deviceIDs.map(deviceID => {
                        return (
                            <div
                                className={styles.item}
                                key={`history-${deviceID}`}>
                                <span>{ deviceID }:</span>
                                <div className={classnames([
                                    styles.item_button
                                ])}>
                                    Occupied
                                </div>
                                <div className={classnames([
                                    styles.item_button
                                ])}>
                                    Vacant
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}