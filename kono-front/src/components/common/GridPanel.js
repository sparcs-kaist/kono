import React from 'react';
import styles from 'styles/GridPanel.module.scss';
import { GridElementPanel } from 'components/common';

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
    gridGapPixels = 7, 
    imageURLs=[],
    imageLinks=[],
    contentPanels=[],
    useDynamicPositioning,
    useOnClick
}) => {

    if (!gridNumRows || !gridNumColumns || !totalWidthPixels)
        return null;

    const gridNumCells = gridNumRows * gridNumColumns;
    const gridCellSize = (totalWidthPixels - gridGapPixels * (gridNumColumns - 1)) / gridNumColumns;
        
    if (useDynamicPositioning) {
        if (!imageURLs || imageURLs.length === 0)
            return null;
        
        const numImages = imageURLs.length;
        const {
            gridRows, gridRowSizes, 
            gridColumns, gridColumnSizes, 
            imageWidthCoeffs, imageHeightCoeffs 
        } = getDynamicGridConfigs(numImages, gridNumCells, gridNumRows, gridNumColumns);

        return (
            <div className={styles.GridPanel}>
            {
                [...Array(gridNumCells).keys()].map(idx => {

                    const isLastGrid = idx === gridNumCells - 1;
                    const numMoreImages = numImages - gridNumCells;
                    const showOverlapPanel = isLastGrid && (numMoreImages > 0);
                    const overlapText = showOverlapPanel && `+ ${numMoreImages}`;
                    const OverlapPanel = showOverlapPanel
                        ? ( <span>{ overlapText }</span> )
                        : null;

                    return (
                        <GridElementPanel
                            key={`element-${idx}`}
                            gridRow={gridRows[idx]}
                            gridRowSize={gridRowSizes[idx]}
                            gridColumn={gridColumns[idx]}
                            gridColumnSize={gridColumnSizes[idx]}
                            imageIndex={idx}
                            imageWidth={gridCellSize * imageWidthCoeffs[idx] + gridGapPixels * (imageWidthCoeffs[idx] - 1)}
                            imageHeight={gridCellSize * imageHeightCoeffs[idx] + gridGapPixels * (imageHeightCoeffs[idx] - 1)}
                            imageURL={imageURLs[idx]}
                            OverlapPanel={OverlapPanel}
                            useOnClick={useOnClick && (idx < numImages)} />
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
            className={styles.GridPanel}
            style={style}>
            {
                [...Array(gridNumCells).keys()].map(idx => {

                    const gridRow = Math.floor(idx / gridNumColumns) + 1;
                    const gridColumn = idx % gridNumColumns + 1;

                    return (
                        <GridElementPanel
                            gridRow={gridRow}
                            gridColumn={gridColumn}
                            imageIndex={idx}
                            imageWidth={gridCellSize}
                            imageHeight={gridCellSize}
                            imageURL={imageURLs ? imageURLs[idx] : null}
                            imageLink={imageLinks[idx]}
                            key={`element-${idx}`}
                            OverlapPanel={contentPanels[idx]}
                            useOnClick={useOnClick} />
                    );
                })
            }
        </div>
    );
}