import React, { useEffect } from 'react';
import { useWebSocket } from 'lib/hooks';

export default () => {

    const [register, unregister] = useWebSocket();

    console.log(register, unregister);

    // useEffect(() => {
    //     const eventHandler = register();
    //     return function cleanup() {
    //         unregister(eventHandler);
    //     }
    // }, [register, unregister]);

    return (
        <div>
            WebSocketController
        </div>
    );

}