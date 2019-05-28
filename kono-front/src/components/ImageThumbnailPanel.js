import React from 'react';
import styles from '../styles/ImageThumbnailPanel.module.scss';

export default ({ grid_index }) => {
    return (
        <div 
            className={styles.ImageThumbnailPanel}
            style={ 
                {
                    grid_column: grid_index % 3 + 1,
                    grid_row   : grid_index > 2 ? 1 : 0
                }
            }>
        </div>
    )
}