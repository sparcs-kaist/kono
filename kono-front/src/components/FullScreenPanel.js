import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/FullScreenPanel.module.scss';
import useWindowDimension from '../lib/hooks/useWindowDimension';
import MaterialIcon from './MaterialIcon';

export default () => {

    const imageURLs = useSelector(state => state.fullscreen.imageURLs, []);
    const imageIndex = useSelector(state => state.fullscreen.imageIndex, []);
    const imageURL = imageURLs[imageIndex];
    const numImages = imageURLs.length;

    const [resizedImageWidth, setResizedImageWidth] = useState(0);
    const [resizedImageHeight, setResizedImageHeight] = useState(0);

    const { width: windowWidth, height: windowHeight } = useWindowDimension();
    const maxImageWidth = windowWidth;
    const maxImageHeight = windowHeight;

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

    return (
        <div className={styles.FullScreenPanel}>
            <div className={styles.FullScreenPanel__content}>
                <div className={styles.FullScreenPanel__arrow}>
                    <MaterialIcon large>chevron_left</MaterialIcon>
                </div>
                <img 
                    src={imageURL} 
                    alt="" 
                    style={imageStyle}
                    onLoad={onLoad} />
                <div className={styles.FullScreenPanel__arrow}>
                    <MaterialIcon large>chevron_right</MaterialIcon>
                </div>
            </div>
            <div className={styles.FullScreenPanel__footer}>
                {
                    [...Array(numImages).keys()].map(idx => {
                        return (
                            <div
                                className={
                                    [
                                        styles.FullScreenPanel__dot, 
                                        idx === imageIndex && styles.FullScreenPanel__dot_highlight
                                    ]
                                    .filter(e => !!e)
                                    .join(' ')
                                }
                                key={`fullscreen-dot-${idx}`}>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}