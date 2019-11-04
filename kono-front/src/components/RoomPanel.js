import React, { useEffect, useState } from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';
import RoomLegendPanel from './RoomLegendPanel';
import RoomNoticeBanner from './RoomNoticeBanner';
import useFetch from '../lib/hooks/useFetch';
import * as RoomAPI from '../api/room';

export default () => {

    const [
        rooms,
        fetchRooms,
        RoomsErrorHandler,
        showRoomsErrorHandler,
        isLoadingRooms
    ] = useFetch(
        [], // initialValue
        {
            fn: RoomAPI.recentList,
            args: []
        }
    );
    const [highlight, setHighlight] = useState('none');

    useEffect(() => {
        fetchRooms();
    }, []);

    const refresh = () => { fetchRooms(); }

    return (
        <div className={styles.RoomPanel}>
            {
                <RoomStatePanel rooms={rooms} highlight={highlight}/>
            }
            {
                <RoomLegendPanel 
                    setHighlight={setHighlight}
                    isLoadingRooms={isLoadingRooms}
                    refresh={refresh}
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