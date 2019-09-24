import React from 'react';
import styles from '../styles/MaterialIcon.module.scss';

export default ({ children, large }) => {
    return (
        <div className={[styles.MaterialIcon, large && styles.MaterialIcon__large]
            .filter(e => !!e)
            .join(' ')}>
            {
                children
            }
        </div>
    );
}