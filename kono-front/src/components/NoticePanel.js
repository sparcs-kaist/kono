import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NoticePanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import * as PostAPI from '../api/post';
import Text from '../res/texts/NoticePanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';
import useFetch from '../lib/hooks/useFetch';

const NOTICE_PAGINATION = 8;
const NOTICE_TITLE_MAX_LENGTH = {
    kr: 24,
    en: 42
};

export default () => {

    const [currentPage, setCurrentPage] = useState(1);

    const [
        numNotices, 
        fetchNumNotices, 
        , // isLoading
        isErrorNumNotices,
        NumNoticesErrorHandler
    ] = useFetch(0);

    const [
        notices,
        fetchNotices,
        , // isLoading
        isErrorNotices,
        NoticesErrorHandler,
    ] = useFetch([]);

    const [text, language] = useLanguages(Text);
    const numPages = Math.max(1, Math.ceil(numNotices / NOTICE_PAGINATION));

    const [titleMaxLength] = useLanguages(NOTICE_TITLE_MAX_LENGTH);
    const toTitleString = (title) => (
        title
            ? (title.length > titleMaxLength ? `${title.substring(0, titleMaxLength)}...` : title)
            : text.null_title
    );

    useEffect(() => {
        fetchNumNotices(PostAPI.count, [], data => data.notice);
    }, [fetchNumNotices]);

    /* Fetch new page when currentPage updates */
    useEffect(() => {
        fetchNotices(PostAPI.list, [{
            params: {
                filter_type: 'notice',
                start_index: (currentPage - 1) * NOTICE_PAGINATION,
                max_size: NOTICE_PAGINATION
            }
        }]);
    }, [fetchNotices, currentPage]);

    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title={text.title} link="/notice"/>
            {
                <NoticesErrorHandler height={291} showErrorText showSpinner showBackground/>
            }
            {
                !isErrorNotices && (
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
                )
            }
            {
               <NumNoticesErrorHandler height={64}/>
            }
            {
                !isErrorNumNotices && (
                    <PanelFooter 
                        currentPage={currentPage} 
                        numPages={numPages}
                        onClickPage={page => setCurrentPage(page)}
                    />
                )
            }
        </div>
    );
}