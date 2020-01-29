import React, { useContext } from 'react';
import styles from 'styles/components/WebsocketController.module.scss';
import { MaterialIcon, Spinner } from 'components/common';
import { WebsocketContext } from 'components/provider/WebsocketProvider';

export default () => {

    const { open, close, state } = useContext(WebsocketContext);

    return (
        <div className={styles.WebsocketController}>
            <MaterialIcon>wifi</MaterialIcon>
            <Spinner />
        </div>
    )

}