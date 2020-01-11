import { useState } from 'react';

const { REACT_APP_JUDGE_WS_URL: host, REACT_APP_JUDGE_WS_PATH: path } = process.env;

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
    }
}

function toCamelCase(eventName) {
    switch (eventName) {
        case 'onopen':
            return 'onOpen';
        case 'onmessage':
            return 'onMessage';
        case 'onerror':
            return 'onError';
        case 'onclose':
            return 'onClose';
        default:
            throw Error(`toCamelCase: unsupported string ${eventName}`);
    }
}

const WebsocketManager = (() => {

    let _websocket = null;
    const _eventListeners = [];

    const eventHandler = (eventName, consoleMessage) => (e) => {
        if (e)
            console.log(e);
        if (consoleMessage)
            console.log(consoleMessage);
        _eventListeners.forEach(eventListener => {
            if (eventListener[toCamelCase(eventName)]) {
                eventListener[toCamelCase(eventName)]();
            }
        });
    }

    const initWebSocket = () => {

        _websocket = new WebSocket(`${host}${path}`);

        /* Setup websocket events */
        _websocket.onopen    = eventHandler('onopen', `[WebSocket] Connection established to host: ${host}`);
        _websocket.onmessage = eventHandler('onmessage');
        _websocket.onerror   = eventHandler('onerror', '[WebSocket] Error occured!');
        _websocket.onclose   = eventHandler('onclose', `[WebSocket] Connection closed from host: ${host}`);

        return _websocket;

    }

    return {
        register: (eventListener) => {
            if (!_websocket) {
                _websocket = initWebSocket();
            }
            _eventListeners.push(eventListener);
        },
        unregister: () => {

        }
    }

})();

export default (initialValue) => {

    const [connectionState, setConnectionState] = useState();
    const [data, setData] = useState(initialValue);

    return [data];

};