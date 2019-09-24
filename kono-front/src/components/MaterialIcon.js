import React from 'react';
import styles from '../styles/MaterialIcon.module.scss';

export default ({ children }) => {
    return (
        <div className={styles.MaterialIcon}>
            {
                children
            }
        </div>
    );
}