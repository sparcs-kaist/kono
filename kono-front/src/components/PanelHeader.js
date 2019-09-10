import React from 'react';
import styles from '../styles/PanelHeader.module.scss';

export default ({ title }) => {
    return (
        <div className={styles.PanelHeader}>
            <span className={styles.PanelHeader__title}>
                { title }
            </span>
        </div>
    )
}