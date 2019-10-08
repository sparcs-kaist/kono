import React, { useState, useEffect } from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import ImageGridPanel from './ImageGridPanel';
import * as ImageAPI from '../api/image';
import Text from '../res/texts/LostFoundPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

const GRID_ROWS = 2;
const GRID_COLUMNS = 3;
const GRID_SIZE = GRID_ROWS * GRID_COLUMNS;

const PANEL_WIDTH = 440;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [numLostFounds, setNumLostFounds] = useState(0);
    const [imageURLs, setImageURLs] = useState([]);

    const numPages = Math.max(1, Math.ceil(numLostFounds / GRID_SIZE));

    const fetchCount = async () => {
        await ImageAPI.count()
            .then(({ data }) => {
                setNumLostFounds(data['lostfound']);
            })
            .catch(({ response }) => {
                console.log(response);
            })
    }

    const fetchPage = async (page) => {
        await ImageAPI.list({
                params: {
                    filter_type: 'lostfound',
                    start_index: (page - 1) * GRID_SIZE,
                    max_size: GRID_SIZE
                }
            })
            .then(({ data }) => {
                setImageURLs(data.map(image => image.url));
            })
            .catch(({ response }) => {
                console.log(response);
            });
    };

    useEffect(() => {
        fetchCount();
    }, [])

    /* Fetch page when currentPage updates */
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage])

    const text = useLanguages(Text);

    /* TODO: Add links to image grids (to post page) */
    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title={text.title} link="/lostfound"/>
            <ImageGridPanel 
                gridNumRows={GRID_ROWS}
                gridNumColumns={GRID_COLUMNS}
                totalWidthPixels={PANEL_WIDTH}
                imageURLs={imageURLs}
            />
            <PanelFooter 
                currentPage={currentPage}
                numPages={numPages}
                onClickPage={page => setCurrentPage(page)}
            />
        </div>
    );

}