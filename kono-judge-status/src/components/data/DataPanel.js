import React, { useContext } from 'react';
import styles from 'styles/components/DataPanel.module.scss';
import { DataContext } from 'components/provider/DataProvider';
import { Spinner } from 'components/common';
import { LineChart } from 'recharts';

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
                    JSON.stringify(data)
                    // <LineChart width={700} height={500} />
                }
            </div>
        </div>
    )

}