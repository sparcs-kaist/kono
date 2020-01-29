import React, { useContext } from 'react';
import styles from 'styles/components/WebsocketController.module.scss';
import { MaterialIcon, Spinner } from 'components/common';
import { WebsocketContext } from 'components/provider/WebsocketProvider';
import * as WebsocketConstants from 'lib/websocket/constants';

export default () => {

    const { open, close, state } = useContext(WebsocketContext);

    return (
        <div className={styles.WebsocketController}>
            <div className={styles.state_wrapper}>
                {
                    ((state) => {
                        switch (state) {
                        case WebsocketConstants.STATE_CLOSED:
                            return (
                                <MaterialIcon fontSize={18}>wifi_off</MaterialIcon>
                            );
                        case WebsocketConstants.STATE_OPEN:
                            return (
                                <MaterialIcon fontSize={18}>wifi</MaterialIcon>
                            );
                        case WebsocketConstants.STATE_CONNECTING:
                        case WebsocketConstants.STATE_CLOSING:
                            return (
                                <Spinner size={18} />
                            );
                        default:
                            return null;
                        }
                    })(state)
                }
                <span>{ state }</span>
            </div>
            <div className={styles.button_wrapper}>
                <div onClick={open}>CONNECT</div>
                <div onClick={close}>DISCONENCT</div>
            </div>
        </div>
    )

}