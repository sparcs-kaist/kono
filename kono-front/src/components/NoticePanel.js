import React from 'react';
import styles from '../styles/NoticePanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import { Link } from 'react-router-dom';

export default ({ posts }) => {
    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title="공지사항" link="/notice"/>
            <ul>
                {
                    posts.map(post => (
                        <li key={`notice-${post.id}`}>
                            <div className={styles.NoticePanel__item}>
                                <span className={styles.NoticePanel__item_title}>
                                    <Link to={`/post/${post.id}`}>
                                        { post.title.length > 24 ? `${post.title.substring(0, 24)}...` : post.title }
                                    </Link>
                                </span>
                                <span className={styles.NoticePanel__item_date}>
                                    { 
                                        post.date.toLocaleString('default', {
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
            <PanelFooter currentPage={1} pagination={5} lastPage={3} onClickPage={(x)=>console.log(x)}/>
        </div>
    );
}