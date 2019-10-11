import React, { useEffect } from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';
import RoomLegendPanel from './RoomLegendPanel';
import MaterialIcon from './MaterialIcon';
import useFetch from '../lib/hooks/useFetch';
import useLanguages from '../lib/hooks/useLanguages';
import * as RoomAPI from '../api/room';
import Text from '../res/texts/RoomPanel.text.json';

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
    
    const text = useLanguages(Text);

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className={styles.RoomPanel}>
            {
                <RoomStatePanel rooms={rooms} />
            }
            <RoomsErrorHandler
                width={600}
                height={'calc(100vh - 180px)'}
                showSpinner
                showErrorText
            />
            {
                <RoomLegendPanel />
            }
            {
                <div className={styles.RoomPanel__refresh}>
                    <MaterialIcon md24 style={{ marginRight: '6px' }}>refresh</MaterialIcon>
                    <span>{ text.refresh }</span>
                </div>
            }
        </div>
    );
}