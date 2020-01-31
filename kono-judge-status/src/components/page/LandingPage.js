import React from 'react';
import { WebsocketController } from 'components/websocket';
import { DataPanel } from 'components/data';

export default () => {

    return (
        <>
            <WebsocketController />
            <DataPanel />
        </>
    );
    
};