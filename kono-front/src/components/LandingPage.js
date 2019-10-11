import React from 'react';
import styles from '../styles/LandingPage.module.scss';
import NoticePanel from './NoticePanel';
import LostFoundPanel from './LostFoundPanel';
import RoomPanel from './RoomPanel';

export default () => {

    return (
        <div className={styles.LandingPage}>
            <div className={styles.LandingPage__room}>
                <RoomPanel />
            </div>
            <div className={styles.LandingPage__post}>
                <NoticePanel />
                <LostFoundPanel />
            </div>
        </div>
    );

}