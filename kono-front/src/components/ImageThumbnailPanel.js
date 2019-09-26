import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../styles/ImageThumbnailPanel.module.scss';
import * as FullscreenActions from '../store/modules/fullscreen';

export default ({
    gridRow, gridRowSize=1, 
    gridColumn, gridColumnSize=1, 
    imageIndex,
    imageWidth, imageHeight,
    imageURL,
    showOverlapPanel, overlapText,
    useOnClick
}) => {

    if (gridRow === undefined || gridColumn === undefined)
        return null;

    const dispatch = useDispatch();
    const [croppedImageWidth, setCroppedImageWidth] = useState(imageWidth);
    const [croppedImageHeight, setCroppedImageHeight] = useState(imageHeight);

    const imageContainerStyle = {
        gridRow: `${gridRow} / ${gridRow + gridRowSize}`,
        gridColumn: `${gridColumn} / ${gridColumn + gridColumnSize}`,
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
        const { naturalWidth, naturalHeight } = img;
        if (naturalWidth > 0 && naturalHeight > 0) {
            const scale = Math.max(imageWidth / naturalWidth, imageHeight / naturalHeight);
            setCroppedImageWidth(naturalWidth * scale);
            setCroppedImageHeight(naturalHeight * scale);
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
                showOverlapPanel ? (
                    <div className={styles.ImageThumbnailPanel__overlap}>
                        <span>{ overlapText }</span>
                    </div>
                ) : null
            }
        </div>
    )
}