import React from 'react';
import styles from '../styles/LandingPage.module.scss';
import NoticePanel from './NoticePanel';
import LostFoundPanel from './LostFoundPanel';
import RoomPanel from './RoomPanel';

export default () => {
    return (
        <div className={styles.LandingPage}>
            <div className={styles.LandingPage__left}>
                <NoticePanel />
                <LostFoundPanel />
            </div>
            <div className={styles.LandingPage__right}>
                <RoomPanel />
            </div>
        </div>
    );
}