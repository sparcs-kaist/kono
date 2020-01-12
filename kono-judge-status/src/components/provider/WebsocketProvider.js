import React, { createContext, useState } from 'react';
import { WebsocketManager } from 'lib/websocket';
import * as constants from 'lib/websocket/constants';

const websocketManager = WebsocketManager();

export const WebsocketContext = createContext();

export default ({ children }) => {

    const open = () => {
        websocketManager.open(setContext);
    }

    const close = () => {
        websocketManager.close(setContext);
    }

    const initialContext = {
        open,
        close,
        state: constants.STATE_CLOSED,
        data: null
    };

    const [context, setContext] = useState(initialContext);

    return (
        <WebsocketContext.Provider value={context}>
            { children }
        </WebsocketContext.Provider>
    )

}