import React from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';

export default () => {

    const rooms = [
        {
            room_number: 1,
            state: 0,
            timestamp: new Date()
        },
        {
            room_number: 2,
            state: 1,
            timestamp: new Date()
        },
        {
            room_number: 3,
            state: 1,
            timestamp: new Date()
        },
        {
            room_number: 4,
            state: 1,
            timestamp: new Date()
        },
        {
            room_number: 5,
            state: 0,
            timestamp: new Date()
        },
        {
            room_number: 6,
            state: 0,
            timestamp: new Date()
        },
        {
            room_number: 7,
            state: 1,
            timestamp: new Date()
        },
    ]

    return (
        <div className={styles.RoomPanel}>
            <RoomStatePanel rooms={rooms} />
        </div>
    );
}