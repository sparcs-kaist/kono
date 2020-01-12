import * as constants from 'lib/websocket/constants';

const { REACT_APP_JUDGE_WS_URL, REACT_APP_JUDGE_WS_PATH } = process.env;
const HOST = `${REACT_APP_JUDGE_WS_URL}${REACT_APP_JUDGE_WS_PATH}`;

const INITIAL_PACKET = new Uint32Array([0, -1, 0, 0, 0, 0, 0, 0]).buffer;

export default () => {

    let _websocket = null;

    return {
        open: (setContext) => {

            if (_websocket)
                return;

            const onopen = (e) => {
                console.log(`[Websocket] Connection established to host: ${HOST}`);
                setContext(prevState => ({
                    ...prevState,
                    state: constants.STATE_OPEN
                }));
                _websocket.send(INITIAL_PACKET);
            };
        
            const onmessage = (e) => {
                const { data } = e;
                setContext(prevState => ({
                    ...prevState,
                    data
                }));
            };
        
            const onerror = (e) => {
                console.log('[Websocket] Error occured!');
                console.log(e);
            };
        
            const onclose = (e) => {
                console.log(`[Websocket] Disconnected from host: ${HOST}`);
                setContext(prevState => ({
                    ...prevState,
                    state: constants.STATE_CLOSED
                }));
            };

            _websocket = new WebSocket(HOST);
            _websocket.onopen    = onopen;
            _websocket.onmessage = onmessage;
            _websocket.onerror   = onerror;
            _websocket.onclose   = onclose;

            setContext(prevState => ({
                ...prevState,
                state: constants.STATE_CONNECTING
            }));
        },

        close: (setContext) => {
            if (_websocket)
                _websocket.close(constants.WEBSOCKET_CLOSE_CODE);
            
            _websocket = null;

            setContext(prevState => ({
                ...prevState,
                state: constants.STATE_CLOSING
            }));
        }
    };

};