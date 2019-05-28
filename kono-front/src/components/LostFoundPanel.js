import React from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import ImageGridPanel from './ImageGridPanel';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div className={styles.LostFoundPanel}>
            <div className={styles.LostFoundPanel__header}>
                <div className={styles.LostFoundPanel__title}>
                    분실물
                </div>
                <div className={styles.LostFoundPanel__link}>
                    <Link to='/lostfound'>
                        +더보기
                    </Link>
                </div>
            </div>
            <ImageGridPanel />
        </div>
    );
}