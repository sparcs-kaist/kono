import React, { useState } from 'react';
import styles from 'styles/components/HistoryEditor.module.scss';
import classnames from 'lib/classnames';
import { MaterialIcon } from 'components/common';

export default ({ deviceIDs }) => {

    const [selectedDropdown, setSelectedDropdown] = useState(null);

    const showDetail = selectedDropdown !== null;

    return (
        <div className={styles.HistoryEditor}>
            <div className={styles.content_wrapper}>
                <span className={styles.title}>State Editor</span>
                {
                    deviceIDs.map(deviceID => {
                        const hide = (selectedDropdown !== null) && (selectedDropdown !== deviceID);
                        const selected = (selectedDropdown === deviceID);
                        const onToggleHide = () => {
                            if (selected)
                                setSelectedDropdown(null);
                            else
                                setSelectedDropdown(deviceID);
                        }
                        return (
                            <div
                                className={classnames([
                                    styles.item,
                                    selected && styles.item_selected,
                                    hide && styles.item_hide
                                ])}
                                key={`history-${deviceID}`}>
                                <span>{ deviceID }</span>
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
                                <div className={styles.dropdown}
                                    onClick={onToggleHide}>
                                    <MaterialIcon fontSize={16}>
                                        {
                                            selected ? 'clear' : 'keyboard_arrow_down'
                                        }
                                    </MaterialIcon>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    <div className={classnames([
                        styles.item_detail,
                        !showDetail && styles.item_hide
                    ])}>

                    </div>
                }
            </div>
        </div>
    )

}