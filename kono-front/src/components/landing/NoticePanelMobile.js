import React from 'react';
import styles from 'styles/NoticePanelMobile.module.scss';
import { Link } from 'react-router-dom';
import { PanelHeader } from 'components/landing';
import { GridPanel } from 'components/common';
import { useLanguages } from 'lib/hooks';

const CELL_SIZE = 203;
const GAP_SIZE = 7;

export default ({
    notices,
    text,
    isError, ErrorHandler
}) => {

    const numColumns = notices.length;
    const panelWidth = CELL_SIZE * numColumns + GAP_SIZE * (numColumns - 1);

    const NoticeComponent = ({ sid, title_kr, title_en, created_time, thumbnail }) => {

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
            <div className={styles.grid_item}>
                <Link to={`/post/${sid}`}>
                    <div className={styles.grid_item_date}>{ dateString }</div>
                    <div className={styles.grid_item_title}>{ titleString }</div>
                </Link>
            </div>
        );

    }

    return (
        <div className={styles.NoticePanelMobile}>
            <PanelHeader title={text.title}/>
            {
                !isError && (
                    <div className={styles.grid_wrapper}>
                        <GridPanel
                            gridNumRows={1}
                            gridNumColumns={numColumns}
                            totalWidthPixels={panelWidth}
                            gridGapPixels={GAP_SIZE}
                            imageURLs={notices.map(notice => notice.thumbnail)}
                            contentPanels={notices.map(NoticeComponent)}
                            useDefaultBackground
                            useBackgroundImageBlur
                        />
                    </div>
                )
            }
            {
                <ErrorHandler height={203} showErrorText showSpinner showBackground />
            }
        </div>
    )

}