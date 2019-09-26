import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/FullScreenPanel.module.scss';
import classnames from '../lib/classnames';
import useWindowDimension from '../lib/hooks/useWindowDimension';
import MaterialIcon from './MaterialIcon';
import * as FullscreenActions from '../store/modules/fullscreen';

export default () => {

    const dispatch = useDispatch();

    const imageURLs = useSelector(state => state.fullscreen.imageURLs, []);
    const imageIndex = useSelector(state => state.fullscreen.imageIndex, []);
    const imageURL = imageURLs[imageIndex];
    const numImages = imageURLs.length;

    const [resizedImageWidth, setResizedImageWidth] = useState(0);
    const [resizedImageHeight, setResizedImageHeight] = useState(0);

    const { width: windowWidth, height: windowHeight } = useWindowDimension();
    const maxImageWidth = windowWidth;
    const maxImageHeight = .8 * windowHeight;

    const imageStyle = {
        width: `${resizedImageWidth}px`,
        height: `${resizedImageHeight}px`
    };

    const onLoad = ({ target: img }) => {
        const { naturalWidth, naturalHeight } = img;
        if (naturalWidth > 0 && naturalHeight > 0) {
            const desiredWidth = Math.min(maxImageWidth, naturalWidth);
            const desiredHeight = Math.min(maxImageHeight, naturalHeight);
            const scale = Math.min(desiredWidth / naturalWidth, desiredHeight / naturalHeight);
            setResizedImageWidth(scale * naturalWidth);
            setResizedImageHeight(scale * naturalHeight);
        }
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
        <div className={styles.FullScreenPanel}>
            <div className={styles.FullScreenPanel__content}>
                <div 
                    className={styles.FullScreenPanel__arrow}
                    onClick={onClickPrev}>
                    <MaterialIcon large>chevron_left</MaterialIcon>
                </div>
                <img 
                    src={imageURL} 
                    alt="" 
                    style={imageStyle}
                    onLoad={onLoad} />
                <div 
                    className={styles.FullScreenPanel__arrow}
                    onClick={onClickNext}>
                    <MaterialIcon large>chevron_right</MaterialIcon>
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