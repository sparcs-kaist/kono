import React, { createContext, useState } from 'react';

export const WebsocketContext = createContext();

const { REACT_APP_JUDGE_WS_URL, REACT_APP_JUDGE_WS_PATH } = process.env;

const STATE_CONNECTING = 'CONNECTING';
const STATE_OPEN       = 'OPEN';
const STATE_CLOSING    = 'CLOSING';
const STATE_CLOSED     = 'CLOSED';

export default ({ children }) => {

    const host = `${REACT_APP_JUDGE_WS_URL}${REACT_APP_JUDGE_WS_PATH}`;

    const onopen = () => (e) => {
        console.log(`[Websocket] Connection established to host: ${host}`);
        setContext(prevState => ({
            ...prevState,
            state: STATE_OPEN
        }));
    };

    const onmessage = () => (e) => {
        const { data } = e;
        setContext(prevState => ({
            ...prevState,
            message: data
        }));
    };

    const onerror = () => (e) => {
        console.log('[Websocket] Error occured!');
        console.log(e);
    };

    const onclose = () => (e) => {
        console.log(`[Websocket] Disconnected from host: ${host}`);
        setContext(prevState => ({
            ...prevState,
            state: STATE_CLOSED
        }));
    }

    const open = () => {
        const websocket = new WebSocket(host);

        websocket.onopen    = onopen();
        websocket.onmessage = onmessage();
        websocket.onerror   = onerror();
        websocket.onclose   = onclose();
        
        setContext(prevState => ({
            ...prevState,
            websocket,
            state: STATE_CONNECTING
        }));
    };

    const close = () => {
        setContext(prevState => {
            const { websocket } = prevState;
            if (websocket)
                websocket.close(1000);
            return {
                ...prevState,
                websocket: null,
                state: STATE_CLOSING
            };
        });
    }

    const initialContext = {
        websocket: null,
        message: null,
        open,
        close,
        state: STATE_CLOSED
    };

    const [context, setContext] = useState(initialContext);

    return (
        <WebsocketContext.Provider value={context}>
            { children }
        </WebsocketContext.Provider>
    )

}