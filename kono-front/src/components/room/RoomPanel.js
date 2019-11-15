import React, { useEffect, useState } from 'react';
import styles from 'styles/RoomPanel.module.scss';
import { PanelHeader } from 'components/common';
import { RoomStatePanelDesktop, RoomLegendPanel, RoomRefreshButton } from 'components/room';
import { useFetch, useLanguages, useWindowDimension } from 'lib/hooks';
import * as RoomAPI from 'api/room';
import Text from 'res/texts/RoomPanel.text.json';

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

    const { width } = useWindowDimension();
    const showDesktopLayout = width >= 800;

    const [text] = useLanguages(Text);

    const refreshRooms = () => {
        fetchRooms(RoomAPI.recentList, []); 
        setLastUpdatedTime(Date.now());
    };

    useEffect(refreshRooms, [fetchRooms]);

    const panelWidth = 600;
    const panelHeight = 600;
    const containerStyle = showDesktopLayout ? {
        width: panelWidth, 
        height: panelHeight
    } : {};
    const mobileRefreshButtonStyles = {
        wrapper: styles.mobile_common_menu,
        icon: styles.icon,
        text: styles.text
    };

    return (
        <div className={styles.RoomPanel}
            style={containerStyle}>
            {
                !showDesktopLayout && (
                    <PanelHeader title={text.title}>
                        <RoomRefreshButton 
                            isLoading={isLoadingRooms}
                            onClickRefresh={refreshRooms}
                            lastUpdatedTime={lastUpdatedTime}
                            styles={mobileRefreshButtonStyles}
                        />
                    </PanelHeader>
                )
            }
            {
                showDesktopLayout && (
                    <>
                        <RoomStatePanelDesktop rooms={rooms} highlight={highlight}/>
                        <RoomLegendPanel 
                            isLoadingRooms={isLoadingRooms}
                            lastUpdatedTime={lastUpdatedTime}
                            refreshRooms={refreshRooms}
                            setHighlight={setHighlight}
                        />
                    </>
                )
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