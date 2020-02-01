import React, { useContext } from 'react';
import styles from 'styles/components/DataPanel.module.scss';
import { DataContext } from 'components/provider/DataProvider';
import { Spinner } from 'components/common';

export default ({ isLoading, selectedDeviceID, selectedFilter }) => {

    const { filter } = useContext(DataContext);

    const showSpinner = isLoading;
    const showData = selectedDeviceID !== null;

    const data = showData
        ? filter(selectedDeviceID, selectedFilter)
        : null;

    return (
        <div className={styles.DataPanel}>
            <div className={styles.content}>
                {
                    showSpinner && <Spinner />
                }
                {
                    !isLoading && 
                    <div>
                        { JSON.stringify(data) }
                    </div>
                }
            </div>
        </div>
    )

}