import React, { useState } from 'react';

const STATE_CONNECTED = 'state/connected';
const STATE_CONNECTING = 'state/connecting';
const STATE_DISCONNECTED = 'state/disconnected';

export default () => {

    const [connectionState, setConnectionState] = useState(STATE_DISCONNECTED);

    return (
        <div>
            WebSocketController
        </div>
    );

}