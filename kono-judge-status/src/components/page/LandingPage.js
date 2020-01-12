import React from 'react';
import { RawVisualizer } from 'components/visualizer';
import { WebsocketController } from 'components/websocket';

export default () => {

    return (
        <>
            <p>
                Landing Page
            </p>
            <RawVisualizer />
            <WebsocketController />
            <WebsocketController />
        </>
    );
    
};