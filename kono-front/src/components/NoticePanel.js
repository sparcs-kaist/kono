import React from 'react';
import styles from '../styles/NoticePanel.module.scss';
import PanelHeader from './PanelHeader';
import { Link } from 'react-router-dom';

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
    }
]

export default () => {
    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title="공지사항" link="/notice"/>
            <ul>
                {
                    __temp__notices.map(notice => (
                        <li key={`notice-${notice.id}`}>
                            <div className={styles.NoticePanel__item}>
                                <span className={styles.NoticePanel__item_title}>
                                    <Link to={`/notice/${notice.id}`}>
                                        { notice.title.length > 27 ? `${notice.title.substring(0, 27)}...` : notice.title }
                                    </Link>
                                </span>
                                <span className={styles.NoticePanel__item_date}>
                                    { 
                                        notice.date.toLocaleString('default', {
                                            year:  'numeric',
                                            month: '2-digit',
                                            day:   '2-digit'
                                        })
                                    }
                                </span>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}