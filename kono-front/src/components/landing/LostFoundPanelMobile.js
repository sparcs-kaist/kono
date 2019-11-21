import React, { useRef, useEffect } from 'react';
import styles from 'styles/LostFoundPanelMobile.module.scss';
import { GridPanel, PanelHeader } from 'components/common';

const CELL_SIZE = 203;
const GAP_SIZE = 7;
const SCROLL_LIMIT_THRESHOLD = 50;
const MOBILE_PAGINATION = 8;

export default ({
    imageURLs, imageLinks,
    numPages,
    currentPage, setCurrentPage,
    ErrorHandler,
    text,
    setPagination
}) => {

    const numColumns = imageURLs.length;
    const panelWidth = CELL_SIZE * numColumns + GAP_SIZE * (numColumns - 1);
    const contentPanel = useRef();

    const onScrollLimit = () => {
        if (currentPage < numPages)
            setCurrentPage(currentPage + 1);
    };
    const onScroll = () => {
        const { scrollLeft, scrollWidth, offsetWidth } = contentPanel.current;
        if (scrollLeft + offsetWidth + SCROLL_LIMIT_THRESHOLD >= scrollWidth)
            onScrollLimit();
    };

    useEffect(() => {
        setPagination(MOBILE_PAGINATION);
    }, [setPagination]);

    return (
        <div className={styles.LostFoundPanelMobile}>
            <div className={styles.header_wrapper}>
                <PanelHeader title={text.title}/>
            </div>
            <div className={styles.grid_wrapper}
                onScroll={onScroll}
                ref={contentPanel}>
                <div className={styles.grid_content}>
                    <GridPanel
                        gridNumRows={1}
                        gridNumColumns={numColumns}
                        totalWidthPixels={panelWidth}
                        gridGapPixels={GAP_SIZE}
                        imageURLs={imageURLs}
                        imageLinks={imageLinks}
                    />
                </div>
            </div>
            <ErrorHandler width={'100%'} height={CELL_SIZE} showErrorText showSpinner showBackground />
        </div>
    );

}