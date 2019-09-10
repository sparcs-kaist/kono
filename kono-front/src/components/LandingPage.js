import React from 'react';
import styles from '../styles/LandingPage.module.scss';
import NoticePanel from './NoticePanel';
import LostFoundPanel from './LostFoundPanel';
import RoomPanel from './RoomPanel';

/* Temporary List of Notices and Dates */
const __temp__notices = [
    {
        id: 1,
        title: '코인노래방 설문조사 참여이벤트 당첨자 안내',
        date: new Date('2019-04-01T00:00:00')
    },
    {
        id: 2,
        title: '당번 방문 시간 변경 안내',
        date: new Date('2019-03-20T00:00:00')
    },
    {
        id: 3,
        title: '카이스트 코인노래방 환기시설 설치 기간 확정 안내',
        date: new Date('2019-03-28T00:00:00')
    },
]

export default () => {
    return (
        <div className={styles.LandingPage}>
            <div className={styles.LandingPage__room}>
                <RoomPanel />
            </div>
            <div className={styles.LandingPage__post}>
                <NoticePanel
                    notices={__temp__notices}
                />
                <LostFoundPanel />
            </div>
        </div>
    );
}