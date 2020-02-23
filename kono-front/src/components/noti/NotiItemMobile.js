import React from 'react';
import styles from 'styles/NotiItemMobile.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ noti }) => {

    const { sid, text } = noti;

    return (
        <div className={styles.NotiItemMobile}>
            <div className={styles.text}>
                <span>{ text }</span>
            </div>
            <div className={styles.clear}>
                <MaterialIcon>clear</MaterialIcon>
            </div>
        </div>
    )

}