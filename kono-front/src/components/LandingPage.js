import React from 'react';
import styles from '../styles/LandingPage.module.scss';
import NoticePanel from './NoticePanel';
import LostFoundPanel from './LostFoundPanel';
import RoomPanel from './RoomPanel';

/* Temporary List of Notices and Dates */
const __temp__posts = [
    {
        id: 1,
        type: 'notice',
        title: '코인노래방 설문조사 참여이벤트 당첨자 안내',
        date: new Date('2019-04-01T00:00:00')
    },
    {
        id: 2,
        type: 'lostfound',
        date: new Date('2019-04-02T00:00:00')
    },
    {
        id: 3,
        type: 'notice',
        title: '당번 방문 시간 변경 안내',
        date: new Date('2019-03-20T00:00:00')
    },
    {
        id: 4,
        type: 'lostfound',
        date: new Date('2019-03-27T00:00:00')
    },
    {
        id: 5,
        type: 'notice',
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
                    posts={__temp__posts.filter(post => post.type === 'notice')}
                />
                <LostFoundPanel
                    posts={__temp__posts.filter(post => post.type === 'lostfound')}
                />
            </div>
        </div>
    );
}