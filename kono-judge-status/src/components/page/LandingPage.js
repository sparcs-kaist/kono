import React from 'react';
import { WebsocketController } from 'components/websocket';
import { RawData } from 'components/landing';

export default () => {

    return (
        <>
            <p>
                Landing Page
            </p>
            <RawData />
            <WebsocketController />
        </>
    );
    
};