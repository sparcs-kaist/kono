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

    
    const croppedImageSize = Math.max(imageWidth, imageHeight);
    const imageContainerStyle = {
        gridRow: gridRowSize ? `${gridRow} / ${gridRow + gridRowSize}` : gridRow,
        gridColumn: gridColumnSize ? `${gridColumn} / ${gridColumn + gridColumnSize}` : gridColumn,
        width: `${imageWidth}px`,
        height: `${imageHeight}px`
    };
    const imageStyle = {
        width: `${croppedImageSize}px`,
        height: `${croppedImageSize}px`,
        position: 'relative',
        top: `${.5 * (imageHeight - croppedImageSize)}px`, // Center image vertically
        left: `${.5 * (imageWidth - croppedImageSize)}px`  // Center image horizontally
    };

    return (
        <div 
            className={styles.ImageThumbnailPanel}
            style={imageContainerStyle}>
            {
                imageURL ? (
                    <img 
                        src={imageURL} 
                        alt={imageURL}
                        style={imageStyle}
                        width={croppedImageSize} 
                        height={croppedImageSize} />
                ) : null
            }
        </div>
    )
}