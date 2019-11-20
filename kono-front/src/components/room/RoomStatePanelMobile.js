import React from 'react';
import styles from 'styles/RoomStatePanelMobile.module.scss';
import Text from 'res/texts/RoomStatePanel.text.json';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';

const ROOM_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

function formatState(state) {
    if (state === 0)
        return 'empty';
    if (state === 1)
        return 'filled';
    return 'null';
}

export default ({ rooms }) => {

    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state } = room || {};
        const stateType = formatState(state);

        return (
            <div className={classnames([
                styles.item,
                styles[`room_${stateType}`],
                styles[`item_${room_idx}`]
            ])}>
                { room_idx }
            </div>
        )

    }

    return (
        <div className={styles.RoomStatePanelMobile}>
            <div className={styles.grid}>
                {
                    ROOM_NUMBERS.map(i => roomComponents(i))
                }
            </div>
        </div>
    )

}