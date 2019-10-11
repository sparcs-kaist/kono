import React from 'react';
import styles from '../styles/RoomDetailPanel.module.scss';

export default ({ x = 0, y = 0, room }) => {

    const { room_number, state, timestamp } = room || {};

    return (
        <div 
            className={styles.RoomDetailPanel}
            style={{
                top: y,
                left: x
            }}
        >
            <span>{ room_number }</span>
            <span>{ state }</span>
        </div>
    )

}