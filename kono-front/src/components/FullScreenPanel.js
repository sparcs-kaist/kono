import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/FullScreenPanel.module.scss';
import MaterialIcon from './MaterialIcon';

export default () => {

    const imageURLs = useSelector(state => state.fullscreen.imageURLs, []);
    const imageIndex = useSelector(state => state.fullscreen.imageIndex, []);
    const imageURL = imageURLs[imageIndex];

    return (
        <div className={styles.FullScreenPanel}>
            <div className={styles.FullScreenPanel__content}>
                <MaterialIcon>chevron_left</MaterialIcon>
                <div className={styles.FullScreenPanel__image_container}>
                    <img src={imageURL} alt="" />
                </div>
                <MaterialIcon>chevron_right</MaterialIcon>
            </div>
            <div>
                dots
            </div>
        </div>
    )

}