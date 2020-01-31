import React from 'react';
import { WebsocketController } from 'components/websocket';
import { DataPanel } from 'components/data';

export default () => {

    return (
        <>
            <p>
                Landing Page
            </p>
            <WebsocketController />
            <DataPanel />
        </>
    );
    
};