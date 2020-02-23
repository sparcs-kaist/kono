import React from 'react';
import styles from 'styles/NotiItemMobile.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ noti, edit, close, remove, login }) => {

    const { text } = noti;

    return (
        <div className={styles.NotiItemMobile}>
            <div className={styles.text}>
                <span>{ text }</span>
            </div>
            {
                login && (
                    <>
                        <div className={styles.right_icon} onClick={edit}>
                            <MaterialIcon>create</MaterialIcon>
                        </div>
                        <div className={styles.right_icon} onClick={remove}>
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