import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/NoticePanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import { Link } from 'react-router-dom';
import * as PostAPI from '../api/post';

const NOTICE_PAGINATION = 8;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [numNotices, setNumNotices] = useState(0);
    const [notices, setNotices] = useState([]);
    const language = useSelector(state => state.config.language, []);

    const numPages = Math.max(1, Math.ceil(numNotices / NOTICE_PAGINATION));

    const fetchPage = async (page) => await PostAPI.list({
            params: {
                filter_type: 'notice',
                start_index: (page - 1) * NOTICE_PAGINATION,
                max_size: NOTICE_PAGINATION
            }
        })
        .then(({ data }) => {
            setNumNotices(data.size);
            setNotices(data.posts);
        })
        .catch(({ response }) => {
            console.log(response);
        });

    /* Fetch page when currentPage updates */
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage])

    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title="공지사항" link="/notice"/>
            <ul>
                {
                    notices.map(({
                        sid, type, title_kr, title_en, created_time
                    }) => {
                        
                        /* TODO: change this using useLanguages hook (issue #14) */
                        const title = language === 'kr' ? title_kr : title_en;
                        const date = new Date(created_time);

                        return (
                            <li key={`notice-${sid}`}>
                                <div className={styles.NoticePanel__item}>
                                    <span className={styles.NoticePanel__item_title}>
                                        <Link to={`/post/${sid}`}>
                                            {
                                                title 
                                                ? (title.length > 24 ? `${title.substring(0, 24)}...` : title)
                                                : '[제목 없음]' // TODO: change null title using useLanguages hook (issue #14)
                                            }
                                        </Link>
                                    </span>
                                    <span className={styles.NoticePanel__item_date}>
                                        { 
                                            date.toLocaleString('default', {
                                                year:  'numeric',
                                                month: '2-digit',
                                                day:   '2-digit'
                                            })
                                        }
                                    </span>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
            <PanelFooter 
                currentPage={currentPage} 
                numPages={numPages}
                onClickPage={page => setCurrentPage(page)}
            />
        </div>
    );
}