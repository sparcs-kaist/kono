import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/NoticePanelDesktop.module.scss';
import { PanelHeader, PanelFooter } from 'components/landing';

export default ({
    notices,
    numPages, currentPage, setCurrentPage,
    isError, ErrorHandler,
    text
}) => {

    const NoticeComponent = ({ sid, title, created_time }) => {
        
        const date = new Date(created_time);

        const titleString = title;
        const dateString = date.toLocaleString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return (
            <li key={`notice-desktop-${sid}`}>
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
                <ErrorHandler showErrorText showSpinner showBackground />
            </ul>
            <PanelFooter
                currentPage={currentPage}
                numPages={numPages}
                onClickPage={(page) => { setCurrentPage(page) }}
            />
        </div>
    );

}