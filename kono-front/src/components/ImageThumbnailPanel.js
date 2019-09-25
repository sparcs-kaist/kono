import React from 'react';
import styles from '../styles/ImageThumbnailPanel.module.scss';

export default ({ gridNumRows, gridNumColumns, gridIndex, imageSize, imageURL }) => {

    if (!gridNumRows || !gridNumColumns || gridIndex === undefined)
        return null;

    const style = {
        gridRow: Math.floor(gridIndex / gridNumColumns) + 1,
        gridColumn: gridIndex % gridNumColumns + 1,
        width: `${imageSize}px`,
        height: `${imageSize}px`
    };

    return (
        <div 
            className={styles.ImageThumbnailPanel}
            style={style}>
        </div>
    )
}