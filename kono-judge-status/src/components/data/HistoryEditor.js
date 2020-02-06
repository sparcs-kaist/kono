import React, { useContext, useState } from 'react';
import styles from 'styles/components/HistoryEditor.module.scss';
import classnames from 'lib/classnames';
import { MaterialIcon } from 'components/common';
import { HistoryContext } from 'components/provider/HistoryProvider';

export default ({ deviceIDs }) => {

    const { history, push } = useContext(HistoryContext);

    console.log(history);

    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const [roomStates, setRoomStates] = useState({});

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
                        };

                        const occupiedSelected = (roomStates[deviceID] === true);
                        const vacantSelected = (roomStates[deviceID] === false);
                        const onClickOccupied = () => {
                            if (occupiedSelected)
                                setRoomStates(prev => ({ ...prev, [deviceID]: undefined }));
                            else
                                setRoomStates(prev => ({ ...prev, [deviceID]: true }));
                        }
                        const onClickVacant = () => {
                            if (vacantSelected)
                                setRoomStates(prev => ({ ...prev, [deviceID]: undefined }));
                            else
                                setRoomStates(prev => ({ ...prev, [deviceID]: false }));
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
                                    styles.item_button,
                                    occupiedSelected && styles.button_selected
                                ])}
                                    onClick={onClickOccupied}>
                                    Occupied
                                </div>
                                <div className={classnames([
                                    styles.item_button,
                                    vacantSelected && styles.button_selected
                                ])}
                                    onClick={onClickVacant}>
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
                <div className={styles.warning}>
                    <MaterialIcon fontSize={12}>warning</MaterialIcon>
                    <span>Refreshing will not preserve history!</span>
                </div>
            </div>
        </div>
    )

}