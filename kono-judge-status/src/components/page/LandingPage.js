import React from 'react';
import { RawVisualizer } from 'components/visualizer';
import { WebSocketController } from 'components/websocket';

export default () => {
    return (
        <>
            <p>
                Landing Page
            </p>
            <RawVisualizer />
            <WebSocketController />
        </>
    );
};