import React from 'react';
import styles from '../styles/ImageGridPanel.module.scss';
import ImageThumbnailPanel from './ImageThumbnailPanel';

function getDynamicGridConfigs(numImages, gridNumCells, gridNumRows, gridNumColumns) {

    /* This code works only if gridNumRows === 2 and gridColumns === 2.
     * For other configurations, do it yourself :)
     */
    if (gridNumRows === 2 && gridNumColumns === 2) {
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
                    gridRows          : [...Array(gridNumCells).keys()].map(i => Math.floor(i / gridNumColumns) + 1),
                    gridRowSizes      : Array(gridNumCells).fill(1), // [1] * gridNumCells
                    gridColumns       : [...Array(gridNumCells).keys()].map(i => i % gridNumColumns + 1),
                    gridColumnSizes   : Array(gridNumCells).fill(1), // [1] * gridNumCells
                    imageWidthCoeffs  : Array(gridNumCells).fill(1), // [1] * gridNumCells
                    imageHeightCoeffs : Array(gridNumCells).fill(1), // [1] * gridNumCells
                };
        }
    }

    return {
        gridRows          : [...Array(gridNumCells).keys()].map(i => Math.floor(i / gridNumColumns) + 1),
        gridRowSizes      : Array(gridNumCells).fill(1), // [1] * gridNumCells
        gridColumns       : [...Array(gridNumCells).keys()].map(i => i % gridNumColumns + 1),
        gridColumnSizes   : Array(gridNumCells).fill(1), // [1] * gridNumCells
        imageWidthCoeffs  : Array(gridNumCells).fill(1), // [1] * gridNumCells
        imageHeightCoeffs : Array(gridNumCells).fill(1), // [1] * gridNumCells
    }

}

export default ({ 
    gridNumRows, 
    gridNumColumns, 
    totalWidthPixels, 
    imageURLs,
    useDynamicPositioning,
    useOnClick
}) => {

    if (!gridNumRows || !gridNumColumns || !totalWidthPixels)
        return null;


    const gridNumCells = gridNumRows * gridNumColumns;
    const gridCellSize = (totalWidthPixels - 7 * (gridNumColumns - 1)) / gridNumColumns;
        
    if (useDynamicPositioning) {
        if (!imageURLs || imageURLs.length === 0)
            return null;
        
        const numImages = imageURLs.length;
        const gridConfigs = getDynamicGridConfigs(numImages, gridNumCells, gridNumRows, gridNumColumns);
        const { gridRows, gridRowSizes, gridColumns, gridColumnSizes, imageWidthCoeffs, imageHeightCoeffs } = gridConfigs;

        return (
            <div className={styles.ImageGridPanel}>
            {
                [...Array(gridNumCells).keys()].map(idx => {

                    const isLastGrid = idx === gridNumCells - 1;
                    const numMoreImages = numImages - gridNumCells;
                    const showOverlapPanel = isLastGrid && (numMoreImages > 0);
                    const overlapText = showOverlapPanel && `+ ${numMoreImages}`;

                    return (
                        <ImageThumbnailPanel
                            key={`thumbnail-${idx}`}
                            gridRow={gridRows[idx]}
                            gridRowSize={gridRowSizes[idx]}
                            gridColumn={gridColumns[idx]}
                            gridColumnSize={gridColumnSizes[idx]}
                            imageIndex={idx}
                            imageWidth={gridCellSize * imageWidthCoeffs[idx] + 7 * (imageWidthCoeffs[idx] - 1)}
                            imageHeight={gridCellSize * imageHeightCoeffs[idx] + 7 * (imageHeightCoeffs[idx] - 1)}
                            imageURL={imageURLs[idx]} 
                            showOverlapPanel={showOverlapPanel}
                            overlapText={overlapText} 
                            useOnClick />
                    );
                })
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
                            imageIndex={idx}
                            imageWidth={gridCellSize}
                            imageHeight={gridCellSize}
                            imageURL={imageURLs ? imageURLs[idx] : null}
                            key={`thumbnail-${idx}`}
                            useOnClick />
                    );
                })
            }
        </div>
    );
}