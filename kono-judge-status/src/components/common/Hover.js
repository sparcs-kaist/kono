import React from 'react';
import styles from 'styles/components/Hover.module.scss';

export default ({ children }) => {

    return (
        <div className={styles.Hover}>
            { children }
        </div>
    )

}