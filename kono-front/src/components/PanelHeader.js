import React from 'react';
import styles from '../styles/PanelHeader.module.scss';
import { Link } from 'react-router-dom';

export default ({ title }) => {
    return (
        <div className={styles.PanelHeader}>
            <span className={styles.PanelHeader__title}>
                { title }
            </span>
        </div>
    )
}