import React from 'react';
import styles from '../styles/ImageGridPanel.module.scss';
import ImageThumbnailPanel from './ImageThumbnailPanel';

function getDynamicGridConfigs(numImages, gridNumCells, gridNumRows, gridNumColumns) {

    switch (numImages) {
        case 1:
            return {
                gridRows          : [1],
                gridRowSizes      : [2],
                gridColumns       : [1],
                gridColumnSizes   : [2],
                imageWidthCoeffs  : [2],
                imageHeightCoeffs : [2]
            };
        case 2:
            return {
                gridRows          : [1, 2],
                gridRowSizes      : [1, 1],
                gridColumns       : [1, 1],
                gridColumnSizes   : [2, 2],
                imageWidthCoeffs  : [2, 2],
                imageHeightCoeffs : [1, 1]
            };
        case 3:
            return {
                gridRows          : [1, 2, 2],
                gridRowSizes      : [1, 1, 1],
                gridColumns       : [1, 1, 2],
                gridColumnSizes   : [2, 1, 1],
                imageWidthCoeffs  : [2, 1, 1],
                imageHeightCoeffs : [1, 1, 1]
            };
        default:
            /* numImages >= 4 */
            return {
                gridRows          : [...Array(gridNumCells).keys()].map(i => Math.floor(i / gridNumRows) + 1),
                gridRowSizes      : [...Array(gridNumCells)].map(_ => 1), // [1] * gridNumCells
                gridColumns       : [...Array(gridNumCells).keys()].map(i => i % gridNumColumns + 1),
                gridColumnSizes   : [...Array(gridNumCells)].map(_ => 1), // [1] * gridNumCells
                imageWidthCoeffs  : [...Array(gridNumCells)].map(_ => 1), // [1] * gridNumCells
                imageHeightCoeffs : [...Array(gridNumCells)].map(_ => 1), // [1] * gridNumCells
            };
    }

}

export default ({ 
    gridNumRows, 
    gridNumColumns, 
    totalWidthPixels, 
    imageURLs,
    useDynamicPositioning
}) => {

    if (!gridNumRows || !gridNumColumns || !totalWidthPixels)
        return null;


    const gridNumCells = gridNumRows * gridNumColumns;
    const gridCellSize = (totalWidthPixels - 7 * (gridNumColumns - 1)) / gridNumColumns;
        
    if (useDynamicPositioning) {
        /* This code works only if gridNumRows === 2 and gridColumns === 2.
         * For other configurations, do it yourself :)
         */
        if (!imageURLs || imageURLs.length === 0)
            return null;
        
        const numImages = imageURLs.length;
        const gridConfigs = getDynamicGridConfigs(numImages, gridNumCells, gridNumRows, gridNumColumns);
        const { gridRows, gridRowSizes, gridColumns, gridColumnSizes, imageWidthCoeffs, imageHeightCoeffs } = gridConfigs;

        return (
            <div className={styles.ImageGridPanel}>
            {
                [...Array(gridNumCells).keys()].map(idx => (
                    <ImageThumbnailPanel
                        key={`thumbnail-${idx}`}
                        gridRow={gridRows[idx]}
                        gridRowSize={gridRowSizes[idx]}
                        gridColumn={gridColumns[idx]}
                        gridColumnSize={gridColumnSizes[idx]}
                        imageWidth={gridCellSize * imageWidthCoeffs[idx] + 7 * (imageWidthCoeffs[idx] - 1)}
                        imageHeight={gridCellSize * imageHeightCoeffs[idx] + 7 * (imageHeightCoeffs[idx] - 1)}
                        imageURL={imageURLs[idx]} />
                ))
            }
            </div>
        );
    }

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

                    const gridRow = Math.floor(idx / gridNumColumns) + 1;
                    const gridColumn = idx % gridNumColumns + 1;

                    return (
                        <ImageThumbnailPanel
                            gridRow={gridRow}
                            gridColumn={gridColumn}
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