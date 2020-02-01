import React, { useContext } from 'react';
import styles from 'styles/components/DataPanel.module.scss';
import { TIME_FILTERS } from 'lib/DataManaging';
import { DataContext } from 'components/provider/DataProvider';
import { Spinner } from 'components/common';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from 'recharts';

function getTimeString(timestamp, showSeconds) {
    const date = new Date(timestamp);
    const formatDigit = (x) => (x >= 10 ? x : `0${x}`);
    if (showSeconds)
        return `${formatDigit(date.getHours())}:${formatDigit(date.getMinutes())}:${formatDigit(date.getSeconds())}`;
    else
        return `${formatDigit(date.getHours())}:${formatDigit(date.getMinutes())}`;
}

export default ({ isLoading, selectedDeviceID, selectedFilter }) => {

    const { filter } = useContext(DataContext);

    const showSpinner = isLoading;
    const showData = selectedDeviceID !== null;
    const showSeconds = (selectedFilter === TIME_FILTERS[0]) 
        || (selectedFilter === TIME_FILTERS[1]);

    const data = showData
        ? filter(selectedDeviceID, selectedFilter)
        : {};
    const dataArray = Object.values(data);

    return (
        <div className={styles.DataPanel}>
            <div className={styles.content}>
                {
                    showSpinner && <Spinner />
                }
                {
                    !isLoading &&
                    <ResponsiveContainer width="100%" height="100%" >
                        <LineChart data={dataArray}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={(time) => getTimeString(time, showSeconds)}    
                            />
                            <YAxis />
                            <Legend />
                            <Line type="linear" dataKey="IR0" stroke="#BBDEFB" 
                                isAnimationActive={false} dot={false}
                            />
                            <Line type="linear" dataKey="IR1" stroke="#C5CAE9" 
                                isAnimationActive={false} dot={false}
                            />
                            <Line type="linear" dataKey="IR2" stroke="#D1C4E9" 
                                isAnimationActive={false} dot={false}
                            />
                            <Line type="linear" dataKey="IR3" stroke="#B2EBF2" 
                                isAnimationActive={false} dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    )

}