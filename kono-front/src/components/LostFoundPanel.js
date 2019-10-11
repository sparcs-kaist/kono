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
        fetchNumImages,
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
        images,
        fetchImages,
        ImagesErrorHandler,
        showImagesErrorHandler
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
        }
    );

    const numPages = Math.max(1, Math.ceil(numImages / GRID_SIZE));
    const imageURLs = images.map(image => image.url);
    const imageLinks = images.map(image => `/post/${image.post_sid}`);

    useEffect(() => {
        fetchNumImages();
    }, [])

    /* Fetch new page when currentPage updates */
    useEffect(() => {
        fetchImages();
    }, [currentPage])

    const text = useLanguages(Text);

    /* TODO: Add links to image grids (to post page) */
    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title={text.title} link="/lostfound"/>
            {
                <ImagesErrorHandler height={291} showErrorText showSpinner showBackground />
            }
            {
                !showImagesErrorHandler && (
                    <ImageGridPanel 
                        gridNumRows={GRID_ROWS}
                        gridNumColumns={GRID_COLUMNS}
                        totalWidthPixels={PANEL_WIDTH}
                        imageURLs={imageURLs}
                        imageLinks={imageLinks}
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