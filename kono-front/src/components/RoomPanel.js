import React, { useEffect } from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';
import RoomLegendPanel from './RoomLegendPanel';
import useFetch from '../lib/hooks/useFetch';
import * as RoomAPI from '../api/room';

export default () => {

    const [
        rooms,
        fetchRooms,
        RoomsErrorHandler,
        showRoomsErrorHandler
    ] = useFetch(
        [], // initialValue
        {
            fn: RoomAPI.recentList,
            args: []
        }
    );

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className={styles.RoomPanel}>
            <RoomsErrorHandler
                width={600}
                height={'calc(100vh - 180px)'}
                showSpinner
                showErrorText
            />
            {
                !showRoomsErrorHandler && (
                    <>
                        <RoomStatePanel rooms={rooms} />
                        <RoomLegendPanel />
                    </>
                )
            }
        </div>
    );
}