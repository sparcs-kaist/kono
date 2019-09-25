import React from 'react';
import styles from '../styles/ImageGridPanel.module.scss';
import ImageThumbnailPanel from './ImageThumbnailPanel';

export default ({ gridNumRows, gridNumColumns, totalWidthPixels, imageURLs }) => {

    if (!gridNumRows || !gridNumColumns || !totalWidthPixels)
        return null;

    const gridNumCells = gridNumRows * gridNumColumns;
    const gridCellSize = (totalWidthPixels - 7 * (gridNumColumns - 1)) / gridNumColumns;
    const style = {
        gridTemplateRows: `repeat(${gridNumRows}, ${gridCellSize}px)`,
        gridTemplateColumns: `repeat(${gridNumColumns}, ${gridCellSize}px)`,
    };

    return (
        <div 
            className={styles.ImageGridPanel}
            style={style}>
            {
                [...Array(gridNumCells).keys()].map(idx => {
                    return (
                        <ImageThumbnailPanel
                            gridNumRows={gridNumRows}
                            gridNumColumns={gridNumColumns}
                            gridIndex={idx}
                            imageSize={gridCellSize}
                            imageURL={imageURLs ? imageURLs[idx] : null}
                            key={`thumbnail-${idx}`}
                        />
                    );
                })
            }
        </div>
    );
}