import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/NoticePanelDesktop.module.scss';
import { PanelHeader, PanelFooter } from 'components/landing';
import { useLanguages } from 'lib/hooks';

export default ({
    notices,
    numPages, currentPage, setCurrentPage,
    isErrorNumNotices, isErrorNotices,
    NumNoticesErrorHandler, NoticesErrorHandler,
    text
}) => {

    const NoticeComponent = ({ sid, title_kr, title_en, created_time }) => {
        
        const [title] = useLanguages({ kr: title_kr, en: title_en });
        const date = new Date(created_time);

        const titleString = title;
        const dateString = date.toLocaleString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return (
            <li key={`notice-${sid}`}>
                <div className={styles.item}>
                    <span className={styles.item_title}>
                        <Link to={`/post/${sid}`}>
                            { titleString }
                        </Link>
                    </span>
                    <span className={styles.item_date}>
                        { dateString }
                    </span>
                </div>
            </li>
        );

    }

    return (
        <div className={styles.NoticePanelDesktop}>
            <PanelHeader title={text.title}/>
            {
                <NoticesErrorHandler height={291} showErrorText showSpinner showBackground />
            }
            {
                !isErrorNotices && (
                    <ul>
                        { notices.map(NoticeComponent) }
                    </ul>
                )
            }
            {
                <NumNoticesErrorHandler height={64} />
            }
            {
                !isErrorNumNotices && (
                    <PanelFooter
                        currentPage={currentPage}
                        numPages={numPages}
                        onClickPage={(page) => { setCurrentPage(page) }}
                    />
                )
            }
        </div>
    );

}