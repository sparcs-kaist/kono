import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/FullScreenPanel.module.scss';
import classnames from '../lib/classnames';
import useWindowDimension from '../lib/hooks/useWindowDimension';
import MaterialIcon from './MaterialIcon';
import * as FullscreenActions from '../store/modules/fullscreen';

function getResizedImageDimension(windowWidth, windowHeight, naturalImageWidth, naturalImageHeight) {

    if (naturalImageWidth === 0 || naturalImageHeight === 0)
        return {
            width: 0,
            height: 0
        };

    const ARROWS_WIDTH_PIXELS = 88 * 2;
    const WINDOW_HEIGHT_RATIO = 0.8;
    const FOOTER_HEIGHT_PIXELS = 34;

    const maxImageWidth = windowWidth - ARROWS_WIDTH_PIXELS;
    const maxImageHeight = (windowHeight - FOOTER_HEIGHT_PIXELS) * WINDOW_HEIGHT_RATIO;

    const desiredWidth = Math.min(maxImageWidth, naturalImageWidth);
    const desiredHeight = Math.min(maxImageHeight, naturalImageHeight);

    const scale = Math.min(desiredWidth / naturalImageWidth, desiredHeight / naturalImageHeight);

    return {
        width: scale * naturalImageWidth,
        height: scale * naturalImageHeight
    };

}

export default () => {

    const dispatch = useDispatch();

    const imageURLs = useSelector(state => state.fullscreen.imageURLs, []);
    const imageIndex = useSelector(state => state.fullscreen.imageIndex, []);
    const imageURL = imageURLs[imageIndex];
    const numImages = imageURLs.length;

    const [naturalImageWidth, setNaturalImageWidth] = useState(0);
    const [naturalImageHeight, setNaturalImageHeight] = useState(0);

    const { width: windowWidth, height: windowHeight } = useWindowDimension();
    const { width: resizedImageWidth, height: resizedImageHeight } = getResizedImageDimension(windowWidth, windowHeight, naturalImageWidth, naturalImageHeight);

    const imageStyle = {
        width: `${resizedImageWidth}px`,
        height: `${resizedImageHeight}px`
    };

    const onLoad = ({ target: img }) => {
        const { naturalWidth, naturalHeight } = img;
        setNaturalImageWidth(naturalWidth);
        setNaturalImageHeight(naturalHeight);
    };

    const onClickBackground = (e) => {
        if (e.target === e.currentTarget)
            dispatch(FullscreenActions.SetVisible(false));
    };

    const onClickDot = (index) => () => {
        dispatch(FullscreenActions.SetImageIndex(index));
    };

    const onClickNext = () => {
        dispatch(FullscreenActions.IncrementImageIndex());
    };

    const onClickPrev = () => {
        dispatch(FullscreenActions.DecrementImageIndex());
    };

    return (
        <div 
            className={styles.FullScreenPanel}
            onClick={onClickBackground}>
            <div className={styles.FullScreenPanel__content}>
                <div 
                    className={styles.FullScreenPanel__arrow}
                    onClick={onClickPrev}>
                    <MaterialIcon md48>chevron_left</MaterialIcon>
                </div>
                <img 
                    src={imageURL} 
                    alt="" 
                    style={imageStyle}
                    onLoad={onLoad} />
                <div 
                    className={styles.FullScreenPanel__arrow}
                    onClick={onClickNext}>
                    <MaterialIcon md48>chevron_right</MaterialIcon>
                </div>
            </div>
            <div className={styles.FullScreenPanel__footer}>
                {
                    [...Array(numImages).keys()].map(idx => {
                        return (
                            <div
                                className={styles.FullScreenPanel__dot_wrapper}
                                onClick={onClickDot(idx)}
                                key={`fullscreen-dot-${idx}`} >
                                <div
                                    className={classnames([
                                        styles.FullScreenPanel__dot, 
                                        idx === imageIndex && styles.FullScreenPanel__dot_highlight
                                    ])} >
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}