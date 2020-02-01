import React from 'react';
import styles from 'styles/components/DownloadDetailPanel.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ onEscape }) => {

    return (
        <div className={styles.DownloadDetailPanel}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>Download Data</div>
                    <div onClick={onEscape}>
                        <MaterialIcon 
                            fontSize={24}
                            style={{ cursor: 'pointer' }}
                        >
                            clear
                        </MaterialIcon>
                    </div>
                </div>
                <div className={styles.options}>

                </div>
                <div className={styles.button_wrapper}>
                    <div className={styles.button}>Download</div>
                </div>
            </div>
        </div>
    )

}