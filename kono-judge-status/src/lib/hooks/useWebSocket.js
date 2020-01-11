import { useEffect } from 'react';
import { WebSocketManager } from 'lib/websocket';

const READY_STATE_CONNECTING = 'CONNECTING';
const REDAY_STATE_OPEN       = 'OPEN';
const READY_STATE_CLOSING    = 'CLOSING';
const READY_STATE_CLOSED     = 'CLOSED';

function readyState2String(readyState) {
    switch (readyState) {
        case 0:
            return READY_STATE_CONNECTING;
        case 1:
            return REDAY_STATE_OPEN;
        case 2:
            return READY_STATE_CLOSING;
        case 3:
            return READY_STATE_CLOSED;
        default:
            throw Error(`readyState2String: invalid state value ${readyState}`);
    }
}

export default () => {

    const { register, unregister } = WebSocketManager;

    useEffect(() => {
        const eventListener = register();
        return () => {
            unregister(eventListener);
        };
    });

};