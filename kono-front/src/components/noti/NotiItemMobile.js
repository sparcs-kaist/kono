import React from 'react';
import styles from 'styles/NotiItemMobile.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ noti, close, login }) => {

    const { sid, text } = noti;

    return (
        <div className={styles.NotiItemMobile}>
            <div className={styles.text}>
                <span>{ text }</span>
            </div>
            {
                login && (
                    <>
                        <div className={styles.right_icon}>
                            <MaterialIcon>create</MaterialIcon>
                        </div>
                        <div className={styles.right_icon}>
                            <MaterialIcon>delete</MaterialIcon>
                        </div>
                    </>
                )
            }
            <div className={styles.right_icon} onClick={close}>
                <MaterialIcon>clear</MaterialIcon>
            </div>
        </div>
    )

}