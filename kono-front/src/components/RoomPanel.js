import React, { useEffect, useState } from 'react';
import styles from '../styles/RoomPanel.module.scss';
import RoomStatePanel from './RoomStatePanel';
import RoomLegendPanel from './RoomLegendPanel';
import MaterialIcon from './MaterialIcon';
import Spinner from './Spinner';
import RoomNoticeBanner from './RoomNoticeBanner';
import useFetch from '../lib/hooks/useFetch';
import useLanguages from '../lib/hooks/useLanguages';
import classnames from '../lib/classnames';
import * as RoomAPI from '../api/room';
import Text from '../res/texts/RoomPanel.text.json';

const __temp_notices = [
    '현재 지폐교환기 사용이 불가능합니다.',
    '현재 알파 서비스 중입니다.',
    '...'
];

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

    const showRefreshButton = !isLoadingRooms;
    const showLoadingBanner = isLoadingRooms;
    
    const text = useLanguages(Text);

    useEffect(() => {
        fetchRooms();
    }, []);

    const onClickRefresh = () => { fetchRooms(); }

    return (
        <div className={styles.RoomPanel}>
            {
                <RoomStatePanel rooms={rooms} highlight={highlight}/>
            }
            {
                <RoomLegendPanel setHighlight={setHighlight}/>
            }
            {
                showRefreshButton && (
                    <div className={classnames([
                            styles.RoomPanel__state,
                            styles.RoomPanel__refresh
                        ])}
                        onClick={onClickRefresh}>
                        <MaterialIcon md24>refresh</MaterialIcon>
                        <span>{ text.refresh }</span>
                    </div>
                )
            }
            {
                showLoadingBanner && (
                    <div className={classnames([
                        styles.RoomPanel__state,
                        styles.RoomPanel__loading
                    ])}>
                        <Spinner small primary/>
                        <span>{ text.loading }</span>
                    </div>
                )
            }
            {
                <RoomNoticeBanner notices={__temp_notices}/>
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