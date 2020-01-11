import React from 'react';
import { useWebSocket } from 'lib/hooks';

export default () => {

    useWebSocket();

    return (
        <div>
            WebSocketController
        </div>
    );

}