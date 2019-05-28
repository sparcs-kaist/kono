import React from 'react';
import styles from '../styles/PanelHeader.module.scss';
import { Link } from 'react-router-dom';

export default ({ title, link }) => {
    return (
        <div className={styles.PanelHeader}>
            <span className={styles.PanelHeader__title}>
                { title }
            </span>
            <span className={styles.PanelHeader__link}>
                <Link to={link}>
                    +더보기
                </Link>
            </span>
        </div>
    )
}