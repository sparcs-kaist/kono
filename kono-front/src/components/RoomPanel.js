import React from 'react';
import styles from '../styles/RoomPanel.module.scss';
import { ReactComponent as RoomSVG } from '../res/icons/room.svg';

export default () => {
    return (
        <div className={styles.RoomPanel}>
            <RoomSVG />
        </div>
    );
}