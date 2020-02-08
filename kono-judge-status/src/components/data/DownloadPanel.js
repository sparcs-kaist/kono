import React from 'react';
import styles from 'styles/components/DownloadPanel.module.scss';

export default ({ onClickDownload }) => {
    return (
        <div className={styles.DownloadPanel}>
            <div 
                className={styles.button}
                onClick={onClickDownload}
            >
                <span>Download Data</span>
            </div>
        </div>
    )
}