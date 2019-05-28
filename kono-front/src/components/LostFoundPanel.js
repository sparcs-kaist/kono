import React from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import ImageGridPanel from './ImageGridPanel';

export default () => {
    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title="분실물" link="/lostfound"/>
            <ImageGridPanel />
        </div>
    );
}