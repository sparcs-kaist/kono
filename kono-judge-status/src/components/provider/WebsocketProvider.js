import React, { createContext, useState } from 'react';

const WebsocketContext = createContext();

const { REACT_APP_JUDGE_WS_URL, REACT_APP_JUDGE_WS_PATH } = process.env;

export default ({ children }) => {

    const host = `${REACT_APP_JUDGE_WS_URL}${REACT_APP_JUDGE_WS_PATH}`;

    const onopen = () => (e) => {
        console.log(`[Websocket] Connection established to host: ${host}`);
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
        setWebsocket(null);
    }

    const open = () => {
        const websocket = new WebSocket(host);

        websocket.onopen    = onopen();
        websocket.onmessage = onmessage();
        websocket.onerror   = onerror();
        websocket.onclose   = onclose();
        
        setWebsocket(websocket);
    };

    const close = () => {
        if (websocket)
            websocket.close();
    }

    const initialContext = {
        message: null,
        open,
        close
    };

    const [websocket, setWebsocket] = useState(null);
    const [context, setContext] = useState(initialContext);

    return (
        <WebsocketContext.Provider value={context}>
            { children }
        </WebsocketContext.Provider>
    )

}