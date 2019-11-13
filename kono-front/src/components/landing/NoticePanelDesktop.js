import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/NoticePanelDesktop.module.scss';
import { PanelHeader, PanelFooter } from 'components/landing';
import { useLanguages } from 'lib/hooks';

export default ({
    notices,
    numPages, currentPage, setCurrentPage,
    isError, ErrorHandler,
    text
}) => {

    const NoticeComponent = ({ sid, title_kr, title_en, created_time }) => {
        
        const titleKR = title_kr || text.null_title;
        const titleEN = title_en || titleKR || text.null_title;
        const [title] = useLanguages({ kr: titleKR, en: titleEN });
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
            <ul>
                { !isError && notices.map(NoticeComponent) }
                {
                    <ErrorHandler showErrorText showSpinner showBackground />
                }
            </ul>
            <PanelFooter
                currentPage={currentPage}
                numPages={numPages}
                onClickPage={(page) => { setCurrentPage(page) }}
            />
        </div>
    );

}