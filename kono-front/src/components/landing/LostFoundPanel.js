import React, { useState, useEffect } from 'react';
import styles from 'styles/LostFoundPanel.module.scss';
import { PanelHeader, PanelFooter } from 'components/landing';
import { ImageGridPanel } from 'components/common';
import * as ImageAPI from 'api/image';
import Text from 'res/texts/LostFoundPanel.text.json';
import { useLanguages, useFetch } from 'lib/hooks'

const GRID_ROWS = 2;
const GRID_COLUMNS = 3;
const GRID_SIZE = GRID_ROWS * GRID_COLUMNS;

const PANEL_WIDTH = 440;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);

    const [
        numImages,
        fetchNumImages,
        , // isLoading
        isErrorNumImages,
        NumImagesErrorHandler
    ] = useFetch(0);

    const [
        images,
        fetchImages,
        , // isLoading
        isErrorImages,
        ImagesErrorHandler
    ] = useFetch([]);

    const numPages = Math.max(1, Math.ceil(numImages / GRID_SIZE));
    const imageURLs = images.map(image => image.url);
    const imageLinks = images.map(image => `/post/${image.post_sid}`);

    useEffect(() => {
        fetchNumImages(ImageAPI.count, [], data => data.lostfound);
    }, [fetchNumImages])

    /* Fetch new page when currentPage updates */
    useEffect(() => {
        fetchImages(ImageAPI.list, [{
            params: {
                filter_type: 'lostfound',
                start_index: (currentPage - 1) * GRID_SIZE,
                max_size: GRID_SIZE
            }
        }]);
    }, [fetchImages, currentPage])

    const [text] = useLanguages(Text);

    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title={text.title} link="/lostfound"/>
            {
                <ImagesErrorHandler height={291} showErrorText showSpinner showBackground />
            }
            {
                !isErrorImages && (
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
                !isErrorNumImages && (
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