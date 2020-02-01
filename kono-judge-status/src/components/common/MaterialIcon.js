import React from 'react';
import styles from 'styles/components/MaterialIcon.module.scss';

export default ({ children, fontSize, style }) => {
    return (
        <div className={styles.MaterialIcon} style={{
            fontSize, ...style
        }}>
            { children }
        </div>
    )
}