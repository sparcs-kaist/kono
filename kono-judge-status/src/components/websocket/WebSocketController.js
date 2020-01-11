import React, { useState } from 'react';

const STATE_CONNECTED = 'state/connected';
const STATE_CONNECTING = 'state/connecting';
const STATE_DISCONNECTED = 'state/disconnected';

export default () => {

    const [connectionState, setConnectionState] = useState(STATE_DISCONNECTED);

    const { REACT_APP_JUDGE_API_URL, REACT_APP_JUDGE_WS_URL } = process.env;
    console.log(REACT_APP_JUDGE_API_URL, REACT_APP_JUDGE_WS_URL);

    return (
        <div>
            WebSocketController
        </div>
    );

}