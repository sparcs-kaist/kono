import React from 'react';
import styles from 'styles/components/MaterialIcon.module.scss';

export default ({ children, style }) => {
    return (
        <div className={styles.MaterialIcon} style={style}>
            { children }
        </div>
    )
}