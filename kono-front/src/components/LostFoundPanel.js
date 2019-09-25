import React from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import ImageGridPanel from './ImageGridPanel';

export default () => {
    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title="분실물" link="/lostfound"/>
            <ImageGridPanel 
                gridNumRows={2}
                gridNumColumns={3}
                totalWidthPixels={440}
            />
            <PanelFooter 
                currentPage={2} 
                pagination={5} 
                lastPage={10}
            />
        </div>
    );
}