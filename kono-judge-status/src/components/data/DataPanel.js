import React, { useContext } from 'react';
import styles from 'styles/components/DataPanel.module.scss';
import { TIME_FILTERS } from 'lib/DataManaging';
import { DataContext } from 'components/provider/DataProvider';
import { HistoryContext, filterHistory } from 'components/provider/HistoryProvider';
import { Spinner } from 'components/common';
import {
    ResponsiveContainer, LineChart, CartesianGrid, 
    XAxis, YAxis, Legend, Line, ReferenceArea
} from 'recharts';

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
    const { history } = useContext(HistoryContext);

    const filteredHistory = selectedDeviceID
        ? filterHistory(history, selectedDeviceID)
        : [];

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
                                type="number" domain={['dataMin', 'dataMax']}
                                dataKey="timestamp" 
                                tickFormatter={(time) => getTimeString(time, showSeconds)}    
                            />
                            <YAxis 
                                type="number" domain={['dataMin', 'dataMax']} />
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
                            {
                                filteredHistory.map(({ timestamp, change }, idx) => {
                                    let x1 = Number(timestamp);
                                    let x2 = (idx === filteredHistory.length - 1)
                                        ? Date.now()
                                        : Number(filteredHistory[idx + 1]['timestamp']);
                                    if (dataArray.length === 0 || x2 < dataArray[0]['timestamp'])
                                        return null;
                                    x1 = Math.max(x1, dataArray[0]['timestamp']);
                                    x2 = Math.min(x2, dataArray[dataArray.length - 1]['timestamp']);
                                    const color = (change === undefined)
                                        ? "#263238"
                                        : (change === true) ? "#5C6BC0" : "#EF5350";
                                    return (
                                        <ReferenceArea
                                            key={`reference-${timestamp}`}
                                            x1={x1} x2={x2}
                                            fill={color} fillOpacity={.3}
                                        />
                                    )
                                })
                            }
                        </LineChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    )

}