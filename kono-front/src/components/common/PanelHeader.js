import React from 'react';
import styles from 'styles/PanelHeader.module.scss';

export default ({ title, children }) => {
    return (
        <div className={styles.PanelHeader}>
            <span className={styles.PanelHeader__title}>
                { title }
            </span>
            {
                children && (
                    <div className={styles.common_menu}>
                        { children }
                    </div>
                )
            }
        </div>
    )
}