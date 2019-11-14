import React, { useEffect } from 'react';
import styles from 'styles/LostFoundPanelDesktop.module.scss';
import { PanelHeader, PanelFooter } from 'components/landing';
import { GridPanel } from 'components/common';

const PANEL_WIDTH = 440;
const PANEL_NARROW_WIDTH = 291;

const GRID_ROWS = 2;
const GRID_COLUMNS = 3;
const GRID_NARROW_COLUMNS = 2;

export default ({
    imageURLs, imageLinks,
    numPages,
    currentPage, setCurrentPage,
    isError, ErrorHandler,
    text,
    showNarrowLayout,
    setPagination
}) => {

    const gridColumns = showNarrowLayout ? GRID_NARROW_COLUMNS : GRID_COLUMNS;
    const panelWidth  = showNarrowLayout ? PANEL_NARROW_WIDTH  : PANEL_WIDTH;
    
    useEffect(() => {
        setPagination(GRID_ROWS * gridColumns);
    }, [setPagination, gridColumns]);

    return (
        <div className={styles.LostFoundPanelDesktop}>
            <PanelHeader title={text.title} link="/lostfound"/>
            {
                !isError && (
                    <GridPanel 
                        gridNumRows={GRID_ROWS}
                        gridNumColumns={gridColumns}
                        totalWidthPixels={panelWidth}
                        imageURLs={imageURLs}
                        imageLinks={imageLinks}
                    />
                )
            }
            <ErrorHandler height={291} showErrorText showSpinner showBackground />
            <PanelFooter 
                currentPage={currentPage}
                numPages={numPages}
                onClickPage={page => setCurrentPage(page)}
            />
            
        </div>
    );
    
}