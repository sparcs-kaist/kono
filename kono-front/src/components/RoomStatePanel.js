import React, { Fragment } from 'react';
import styles from '../styles/RoomStatePanel.module.scss';
import SVGPaths from '../res/icons/room.json';

function state2classname(state) {

    if (state === 0)
        return styles.RoomStatePanel__room_empty;
    if (state === 1)
        return styles.RoomStatePanel__room_filled;
    
    return styles.RoomStatePanel__room_null;

}

export default ({ rooms }) => {
    
    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state, timestamp } = room || {};

        return (
            <Fragment key={`room-fragment-${room_idx}`}>
                <path className={state2classname(state)} d={SVGPaths[room_idx]} />
            </Fragment>
        );

    };

    return (
        <svg className={styles.RoomStatePanel} width="541" height="601" viewBox="0 0 541 601" xmlns="http://www.w3.org/2000/svg">
            {
                [1, 2, 3, 4, 5, 6, 7].map(i => roomComponents(i))
            }
        </svg>
    );

}