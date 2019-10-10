import React, { useEffect } from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';
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
        },
        (data) => {
            const processed = {};
            data.forEach(room => { processed[room.room_number] = room; });
            return processed;
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
                    <RoomStatePanel rooms={rooms} />
                )
            }
        </div>
    );
}