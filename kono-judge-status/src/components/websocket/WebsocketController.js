import React, { useContext } from 'react';
import { WebsocketContext } from 'components/provider/WebsocketProvider';

export default () => {

    const { open, close, state, data } = useContext(WebsocketContext);

    return (
        <>
            <h3>
                WebsocketController
            </h3>
            <div>{ state }</div>
            <div>{ data }</div>
            <div onClick={open}>open!</div>
            <div onClick={close}>close!</div>
        </>
    )

}