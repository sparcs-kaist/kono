import React, { useEffect, useState } from 'react';
import styles from 'styles/RoomPanel.module.scss';
import { RoomStatePanel, RoomLegendPanel } from 'components/room';
import { useFetch } from 'lib/hooks';
import * as RoomAPI from 'api/room';

export default () => {

    const [
        rooms,
        fetchRooms,
        isLoadingRooms,
        , // isError
        RoomsErrorHandler,
    ] = useFetch([]);
    const [highlight, setHighlight] = useState('none');
    const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());

    const refreshRooms = () => {
        fetchRooms(RoomAPI.recentList, []); 
        setLastUpdatedTime(Date.now());
    };

    useEffect(refreshRooms, [fetchRooms]);

    const width = 600;
    const height = 600;
    const containerStyle = { width, height };

    return (
        <div className={styles.RoomPanel}
            style={containerStyle}>
            {
                <RoomStatePanel rooms={rooms} highlight={highlight}/>
            }
            {
                <RoomLegendPanel 
                    isLoadingRooms={isLoadingRooms}
                    lastUpdatedTime={lastUpdatedTime}
                    refreshRooms={refreshRooms}
                    setHighlight={setHighlight}
                />
            }
            {
                <RoomsErrorHandler
                    width={600}
                    height={'calc(100vh - 180px)'}
                    showSpinner
                    showErrorText
                />
            }
        </div>
    );
}