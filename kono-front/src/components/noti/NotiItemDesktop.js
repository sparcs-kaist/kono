import React from 'react';
import styles from 'styles/NotiItemDesktop.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ noti, close }) => {

    const { sid, text } = noti;

    return (
        <div className={styles.NotiItemDesktop}>
            <div className={styles.icon}>
                <MaterialIcon>info</MaterialIcon>
            </div>
            <div className={styles.text}>
                <span>{ text }</span>
            </div>
            <div className={styles.clear} onClick={close}>
                <MaterialIcon>clear</MaterialIcon>
            </div>
        </div>
    )

}