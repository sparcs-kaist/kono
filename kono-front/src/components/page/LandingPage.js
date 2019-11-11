import React from 'react';
import styles from 'styles/LandingPage.module.scss';
import { NoticePanel, LostFoundPanel, RoomPanel } from 'components/landing';

export default () => {

    return (
        <div className={styles.LandingPage}>
            <div className={styles.LandingPage__container}>
                <RoomPanel />
            </div>
            <div className={styles.LandingPage__container}>
                <div className={styles.LandingPage__item}>
                    <NoticePanel />
                </div>
                <div className={styles.LandingPage__item}>
                    <LostFoundPanel />
                </div>
            </div>
        </div>
    );

}