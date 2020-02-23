import React, { useEffect, useState } from 'react';
import styles from 'styles/RoomPanel.module.scss';
import { PanelHeader } from 'components/common';
import { RoomStatePanelDesktop, RoomStatePanelMobile, RoomLegendPanel, RoomRefreshButton } from 'components/room';
import { NotiPanel } from 'components/noti';
import { useFetch, useLanguages, useWindowDimension } from 'lib/hooks';
import * as RoomAPI from 'api/room';
import * as NotiAPI from 'api/noti';
import Text from 'res/texts/RoomPanel.text.json';

const MAX_DISPLAY_NOTIS = 8;

export default () => {

    const [
        rooms,
        fetchRooms,
        isLoadingRooms,
        isErrorRooms,
        RoomsErrorHandler,
    ] = useFetch([]);

    const [highlight, setHighlight] = useState('none');
    const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());

    const { isDesktop } = useWindowDimension();

    const [text] = useLanguages(Text);

    const refreshRooms = () => {
        fetchRooms(RoomAPI.recentList, []); 
        setLastUpdatedTime(Date.now());
    };

    useEffect(refreshRooms, [fetchRooms]);

    const panelWidth = isDesktop ? 600 : 'calc(100vw - 64px)';
    const panelHeight = isDesktop ? 600 : 'calc(100vw - 64px)';
    const containerStyle = isDesktop ? {
        width: panelWidth, 
        height: panelHeight
    } : {};
    const mobileRefreshButtonStyles = {
        wrapper: styles.mobile_common_menu,
        icon: styles.icon,
        text: styles.text
    };

    const [
        notis,
        fetchNotis,
        , // isLoading,
        ,
        ,
    ] = useFetch([]);

    const refreshNotis = () => fetchNotis(NotiAPI.retrieve, [{ max_size: MAX_DISPLAY_NOTIS }]);
    useEffect(() => {
        fetchNotis(NotiAPI.retrieve, [{ max_size: MAX_DISPLAY_NOTIS }]);
    }, [fetchNotis]);

    return (
        <div className={styles.RoomPanel}
            style={containerStyle}>
            {
                !isDesktop && (
                    <>
                        <PanelHeader title={text.title}>
                            <RoomRefreshButton 
                                isLoading={isLoadingRooms}
                                onClickRefresh={refreshRooms}
                                lastUpdatedTime={lastUpdatedTime}
                                styles={mobileRefreshButtonStyles}
                            />
                        </PanelHeader>
                        {
                            !isErrorRooms && (
                                <>
                                    <RoomStatePanelMobile rooms={rooms} />
                                    <div className={styles.mobile_legend}>
                                        <NotiPanel notis={notis} 
                                            refresh={refreshNotis} />
                                    </div>
                                </>
                            )
                        }
                    </>
                )
            }
            {
                isDesktop && (
                    <>
                        <RoomStatePanelDesktop rooms={rooms} highlight={highlight}/>
                        <div className={styles.desktop_legend}>
                            <NotiPanel notis={notis} 
                                refresh={refreshNotis} />
                            <RoomLegendPanel 
                                isLoadingRooms={isLoadingRooms}
                                lastUpdatedTime={lastUpdatedTime}
                                refreshRooms={refreshRooms}
                                setHighlight={setHighlight}
                            />
                        </div>
                    </>
                )
            }
            <RoomsErrorHandler
                width={panelWidth}
                height={panelHeight}
                showSpinner
                showErrorText
                showBackground={!isDesktop}
            />
        </div>
    );
}