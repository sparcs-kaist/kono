import React from 'react';
import styles from '../styles/LostFoundPanel.module.scss';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import ImageGridPanel from './ImageGridPanel';
import Text from '../res/texts/LostFoundPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

export default () => {

    const text = useLanguages(Text);

    return (
        <div className={styles.LostFoundPanel}>
            <PanelHeader title={text.title} link="/lostfound"/>
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