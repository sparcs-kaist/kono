import React from 'react';
import styles from '../styles/ImageThumbnailPanel.module.scss';

export default ({
    gridRow, gridRowSize, 
    gridColumn, gridColumnSize, 
    imageWidth, imageHeight,
    imageURL
}) => {

    if (gridRow === undefined || gridColumn === undefined)
        return null;

    const style = {
        gridRow: gridRowSize ? `${gridRow} / ${gridRow + gridRowSize}` : gridRow,
        gridColumn: gridColumnSize ? `${gridColumn} / ${gridColumn + gridColumnSize}` : gridColumn,
        width: `${imageWidth}px`,
        height: `${imageHeight}px`
    };

    return (
        <div 
            className={styles.ImageThumbnailPanel}
            style={style}>
            {
                imageURL ? (
                    <img src={imageURL} alt={imageURL} width={imageWidth} height={imageHeight} />
                ) : null
            }
        </div>
    )
}