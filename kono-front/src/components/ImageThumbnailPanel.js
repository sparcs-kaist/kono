import React, { useState } from 'react';
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
    const [croppedImageWidth, setCroppedImageWidth] = useState(imageWidth);
    const [croppedImageHeight, setCroppedImageHeight] = useState(imageHeight);

    const imageContainerStyle = {
        gridRow: gridRowSize ? `${gridRow} / ${gridRow + gridRowSize}` : gridRow,
        gridColumn: gridColumnSize ? `${gridColumn} / ${gridColumn + gridColumnSize}` : gridColumn,
        width: `${imageWidth}px`,
        height: `${imageHeight}px`
    };
    const imageStyle = {
        width: `${croppedImageWidth}px`,
        height: `${croppedImageHeight}px`,
        position: 'relative',
        top: `${.5 * (imageHeight - croppedImageHeight)}px`, // Center image vertically
        left: `${.5 * (imageWidth - croppedImageWidth)}px`  // Center image horizontally
    };

    const onLoad = ({ target: img }) => {
        /* Dynamically set crop size. */
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            const scale = Math.max(imageWidth / img.naturalWidth, imageHeight / img.naturalHeight);
            setCroppedImageWidth(img.naturalWidth * scale);
            setCroppedImageHeight(img.naturalHeight * scale);
        }
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
                        onLoad={onLoad} />
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