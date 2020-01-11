const { REACT_APP_JUDGE_WS_URL: host, REACT_APP_JUDGE_WS_PATH: path } = process.env;

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
            if (eventListener && eventListener[toCamelCase(eventName)]) {
                eventListener[toCamelCase(eventName)]();
            }
        });
    }

    const initWebSocket = () => {

        _websocket = new WebSocket(`${host}${path}`);

        /* Setup websocket events */
        _websocket.onopen    = eventHandler('onopen',  `[WebSocket] Connection established to host: ${host}`);
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
            return eventListener;
        },
        unregister: (eventListener) => {
            const idx = _eventListeners.findIndex(eventListener);
            if (idx > -1)
                _eventListeners.splice(idx, 1);
            else
                throw Error('unregister: given eventListener was not in the list');
            if (_eventListeners.length === 0) {
                _websocket.close();
                const oldWebSocketCloseHandler = _websocket.onclose;
                // cleanup websocket context when no one is listening
                _websocket.onclose = (e) => {
                    oldWebSocketCloseHandler(e);
                    _websocket = null;
                };
            }
        }
    }

})();

export default WebsocketManager;