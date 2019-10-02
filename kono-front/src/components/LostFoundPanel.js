import React, { useState, useEffect } from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import ImageGridPanel from './ImageGridPanel';
import * as PostAPI from '../api/post';

const GRID_ROWS = 2;
const GRID_COLUMNS = 3;
const GRID_SIZE = GRID_ROWS * GRID_COLUMNS;

const PANEL_WIDTH = 440;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [numLostFounds, setNumLostFounds] = useState(0);
    const [imageURLs, setImageURLs] = useState([]);

    const numPages = Math.max(1, Math.ceil(numLostFounds / GRID_SIZE));

    const fetchPage = async (page) => {
        const lostFounds = await PostAPI.list({
                params: {
                    filter_type: 'lostfound',
                    start_index: (page - 1) * GRID_SIZE,
                    max_size: GRID_SIZE
                }
            })
            .then(({ data }) => {
                setNumLostFounds(data.size);
                return data.posts;
            })
            .catch(({ response }) => {
                console.log(response);
                return;
            });

        /* TODO: This does not handle if a lost found post has more than one image.
         * Should fix kono-api first then handle this by calling a new API. */
        setImageURLs(
            await Promise.all(
                lostFounds.map(async ({ sid }) => {
                    try {
                        const { data } = await PostAPI.single(sid);
                        const { content_img } = data;
                        return content_img[0];
                    } catch (e) {
                        console.log(e);
                        return null;
                    }
                })
            )
        );
    };

    /* Fetch page when currentPage updates */
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage])

    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title="분실물" link="/lostfound"/>
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