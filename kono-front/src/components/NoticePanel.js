import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from '../styles/NoticePanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import * as PostAPI from '../api/post';
import Text from '../res/texts/NoticePanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

const NOTICE_PAGINATION = 8;
const NOTICE_TITLE_MAX_LENGTH = {
    kr: 24,
    en: 42
};

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [numNotices, setNumNotices] = useState(0);
    const [notices, setNotices] = useState([]);
    const text = useLanguages(Text);
    const language = useSelector(state => state.config.language, []);

    const numPages = Math.max(1, Math.ceil(numNotices / NOTICE_PAGINATION));

    const fetchCount = async () => {
        await PostAPI.count()
            .then(({ data }) => {
                setNumNotices(data['notice']);
            })
            .catch(({ response }) => {
                console.log(response);
            })
    }

    const fetchPage = async (page) => {
        await PostAPI.list({
                params: {
                    filter_type: 'notice',
                    start_index: (page - 1) * NOTICE_PAGINATION,
                    max_size: NOTICE_PAGINATION
                }
            })
            .then(({ data }) => {
                setNotices(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchCount();
    }, []);

    /* Fetch page when currentPage updates */
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage]);


    const titleMaxLength = useLanguages(NOTICE_TITLE_MAX_LENGTH);
    const nullTitleString = useLanguages({ kr: '(제목 없음)', en: '(No title)' });
    const toTitleString = (title) => (
        title
            ? (title.length > titleMaxLength ? `${title.substring(0, titleMaxLength)}...` : title)
            : nullTitleString
    );

    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title={text.title} link="/notice"/>
            <ul>
                {
                    notices.map(({
                        sid, title_kr, title_en, created_time
                    }) => {
                        
                        const title = language === 'kr' ? title_kr : title_en; // cannot use useLangauge Hook: overlapping hooks
                        const date = new Date(created_time);

                        return (
                            <li key={`notice-${sid}`}>
                                <div className={styles.NoticePanel__item}>
                                    <span className={styles.NoticePanel__item_title}>
                                        <Link to={`/post/${sid}`}>
                                            { toTitleString(title) }
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