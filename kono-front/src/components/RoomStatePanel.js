import React, { Fragment } from 'react';
import styles from '../styles/RoomStatePanel.module.scss';
import SVGPaths from '../res/icons/room.json';
import classnames from '../lib/classnames';

function state2classname(state) {

    if (state === 0)
        return styles.RoomStatePanel__room_empty;
    if (state === 1)
        return styles.RoomStatePanel__room_filled;
    
    return styles.RoomStatePanel__room_null;

}

function highlight2state(highlight) {

    if (highlight === 'none')
        return 'none';
    if (highlight === 'empty')
        return 0;
    if (highlight === 'filled')
        return 1;
    if (highlight === 'null')
        return undefined;

}

export default ({ rooms, highlight }) => {
    
    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state, timestamp } = room || {};

        return (
            <Fragment key={`room-fragment-${room_idx}`}>
                <path 
                    className={classnames([
                        state2classname(state),
                        (highlight2state(highlight) === state) && styles.RoomStatePanel__room_highlight
                    ])} 
                    d={SVGPaths[room_idx]} 
                />
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