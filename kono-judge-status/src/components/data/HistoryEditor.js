import React from 'react';
import styles from 'styles/components/HistoryEditor.module.scss';
import classnames from 'lib/classnames';

export default ({ deviceIDs }) => {

    return (
        <div className={styles.HistoryEditor}>
            <div className={styles.content_wrapper}>
                {
                    deviceIDs.map(deviceID => {
                        return (
                            <div
                                className={styles.item}
                                key={`history-${deviceID}`}>
                                <span>{ deviceID }</span>
                                <div className={classnames([
                                    styles.item_button,
                                    styles.button_occupied
                                ])}>
                                    Occupied
                                </div>
                                <div className={classnames([
                                    styles.item_button,
                                    styles.button_vacant
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