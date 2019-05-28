import React from 'react';
import styles from '../styles/ImageGridPanel.module.scss';
import ImageThumbnailPanel from './ImageThumbnailPanel';

export default () => {
    return (
        <div className={styles.ImageGridPanel}>
            {
                [...Array(6).keys()].map(idx => {
                    return (
                        <ImageThumbnailPanel
                            grid_index={idx}
                            key={`thumbnail-${idx}`}
                        />
                    );
                })
            }
        </div>
    );
}