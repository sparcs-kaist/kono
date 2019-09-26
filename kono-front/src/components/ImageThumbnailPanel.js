import React from 'react';
import { useDispatch } from 'react-redux';
import styles from '../styles/ImageThumbnailPanel.module.scss';
import * as FullscreenActions from '../store/modules/fullscreen';

export default ({
    gridRow, gridRowSize, 
    gridColumn, gridColumnSize, 
    imageIndex,
    imageWidth, imageHeight,
    imageURL,
    useOverlapPanel, overlapText,
    useOnClick
}) => {

    if (gridRow === undefined || gridColumn === undefined)
        return null;

    const dispatch = useDispatch();

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

    const onClick = () => {
        dispatch(FullscreenActions.SetVisible(true));
        dispatch(FullscreenActions.SetImageIndex(imageIndex));
    };

    return (
        <div 
            className={styles.ImageThumbnailPanel}
            style={imageContainerStyle}
            onClick={useOnClick ? onClick : null}>
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
            {
                useOverlapPanel ? (
                    <div className={styles.ImageThumbnailPanel__overlap}>
                        <span>{ overlapText }</span>
                    </div>
                ) : null
            }
        </div>
    )
}