import React from 'react';
import styles from 'styles/components/FilterSelector.module.scss';
import { Selector } from 'components/common';

export default ({ 
    filters, 
    selectedFilter, 
    setSelectedFilter 
}) => {

    return (
        <div className={styles.FilterSelector}>
            <div className={styles.content_wrapper}>
                <span>Time Filter</span>
                <Selector
                    elements={filters}
                    selected={selectedFilter}
                    setSelected={setSelectedFilter}
                    theme="green"
                />
            </div>
        </div>
    )

}