import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from 'styles/GridElementPanel.module.scss';
import { Spinner } from 'components/common';
import * as FullscreenActions from 'store/modules/fullscreen';
import classnames from 'lib/classnames';
import { ReactComponent as Background1 } from 'res/icons/grid_element_1.svg';
import { ReactComponent as Background2 } from 'res/icons/grid_element_2.svg';

export default ({
    gridRow, gridRowSize=1, 
    gridColumn, gridColumnSize=1, 
    imageIndex,
    imageWidth, imageHeight,
    imageURL, imageLink,
    OverlapPanel,
    useOnClick,
    useDefaultBackground,
    useBackgroundImageBlur,
    useOverlapFilter
}) => {

    if (gridRow === undefined || gridColumn === undefined)
        return null;

    const dispatch = useDispatch();
    const [croppedImageWidth, setCroppedImageWidth] = useState(imageWidth);
    const [croppedImageHeight, setCroppedImageHeight] = useState(imageHeight);
    const [isLoading, setLoading] = useState(false);

    const imageContainerStyle = {
        gridRow: `${gridRow} / ${gridRow + gridRowSize}`,
        gridColumn: `${gridColumn} / ${gridColumn + gridColumnSize}`,
        width: `${imageWidth}px`,
        height: `${imageHeight}px`
    };

    const onLoad = ({ target: img }) => {
        /* Dynamically set crop size. */
        const { naturalWidth, naturalHeight } = img;
        if (naturalWidth > 0 && naturalHeight > 0) {
            const scale = Math.max(imageWidth / naturalWidth, imageHeight / naturalHeight);
            setCroppedImageWidth(naturalWidth * scale);
            setCroppedImageHeight(naturalHeight * scale);
        }
        setLoading(false);
    };

    const onClick = () => {
        dispatch(FullscreenActions.SetVisible(true));
        dispatch(FullscreenActions.SetImageIndex(imageIndex));
    };

    const showDefaultBackground = !imageURL && useDefaultBackground;
    const showBlurredBackground = useBackgroundImageBlur && !showDefaultBackground;
    const showOverlapFilter = useOverlapFilter && !showDefaultBackground;

    const imageStyle = {
        display: isLoading ? 'none' : 'block', // do not show blank div if not loaded
        width: `${croppedImageWidth}px`,
        height: `${croppedImageHeight}px`,
        position: 'relative'
    };

    useEffect(() => {
        if (imageURL)
            setLoading(true);
    }, [imageURL]);

    return (
        <div 
            className={classnames([
                styles.GridElementPanel,
                showDefaultBackground && styles.default_background,
                showBlurredBackground && styles.blur
            ])}
            style={imageContainerStyle}
            onClick={useOnClick ? onClick : undefined}>
            {
                isLoading && <Spinner />
            }
            {
                imageURL && (
                    imageLink
                    ? (
                        <a href={imageLink}>
                            <img
                                src={imageURL} 
                                alt={imageURL}
                                style={imageStyle}
                                onLoad={onLoad}
                            />
                        </a>
                    )
                    : (
                        <img
                            src={imageURL} 
                            alt={imageURL}
                            style={imageStyle}
                            onLoad={onLoad}
                        />
                    )
                )
            } 
            {   showDefaultBackground && (
                    (gridRow + gridColumn) & 1 
                        ? <Background1 />
                        : <Background2 />
                )
            }
            {
                OverlapPanel && (
                    <div className={classnames([
                        styles.overlap,
                        showOverlapFilter && styles.overlap_filter
                    ])}>
                        { OverlapPanel }
                    </div>
                )
            }
        </div>
    )
}