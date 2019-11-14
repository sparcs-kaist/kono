import React, { useRef } from 'react';
import styles from 'styles/NoticePanelMobile.module.scss';
import { Link } from 'react-router-dom';
import { PanelHeader } from 'components/landing';
import { GridPanel } from 'components/common';

const CELL_SIZE = 203;
const GAP_SIZE = 7;

export default ({
    notices,
    numPages, currentPage, setCurrentPage,
    text,
    ErrorHandler
}) => {

    const numColumns = notices.length;
    const panelWidth = CELL_SIZE * numColumns + GAP_SIZE * (numColumns - 1);
    const contentPanel = useRef();

    const onScrollLimit = () => {
        if (currentPage < numPages)
            setCurrentPage(currentPage + 1);
    };
    const onScroll = () => {
        const { scrollLeft, scrollWidth, offsetWidth } = contentPanel.current;
        if (scrollLeft + offsetWidth >= scrollWidth)
            onScrollLimit();
    };

    const NoticeComponent = ({ sid, title, created_time }) => {

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
                (
                    <div className={styles.grid_wrapper}
                        onScroll={onScroll}
                        ref={contentPanel}>
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
                        <ErrorHandler width={CELL_SIZE} height={CELL_SIZE} showErrorText showSpinner showBackground />
                    </div>
                )
            }
        </div>
    )

}