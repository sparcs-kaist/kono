import React, { useState, useEffect } from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import ImageGridPanel from './ImageGridPanel';
import * as ImageAPI from '../api/image';
import Text from '../res/texts/LostFoundPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';
import useFetch from '../lib/hooks/useFetch';

const GRID_ROWS = 2;
const GRID_COLUMNS = 3;
const GRID_SIZE = GRID_ROWS * GRID_COLUMNS;

const PANEL_WIDTH = 440;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);

    const [
        numImages,
        fetchImages,
        NumImagesErrorHandler,
        showNumImagesErrorHandler
    ] = useFetch(
        0, // initialValue
        { // api
            fn: ImageAPI.count,
            args: []
        },
        data => data.lostfound // dataProcessor
    );

    const [
        imageURLs,
        fetchImageURLs,
        ImageURLsErrorHandler,
        showImageURLsErrorHandler
    ] = useFetch(
        [], // initialValue
        { // api
            fn: ImageAPI.list,
            args: [{
                params: {
                    filter_type: 'lostfound',
                    start_index: (currentPage - 1) * GRID_SIZE,
                    max_size: GRID_SIZE
                }
            }]
        },
        data => data.map(image => image.url) // dataProcessor
    );

    const numPages = Math.max(1, Math.ceil(numImages / GRID_SIZE));

    useEffect(() => {
        fetchImages();
    }, [])

    /* Fetch new page when currentPage updates */
    useEffect(() => {
        fetchImageURLs();
    }, [currentPage])

    const text = useLanguages(Text);

    /* TODO: Add links to image grids (to post page) */
    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title={text.title} link="/lostfound"/>
            {
                <ImageURLsErrorHandler height={291} showErrorText showSpinner />
            }
            {
                !showImageURLsErrorHandler && (
                    <ImageGridPanel 
                        gridNumRows={GRID_ROWS}
                        gridNumColumns={GRID_COLUMNS}
                        totalWidthPixels={PANEL_WIDTH}
                        imageURLs={imageURLs}
                    />
                )
            }
            {
                <NumImagesErrorHandler height={64} />
            }
            {
                !showNumImagesErrorHandler && (
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