import React from 'react';
import styles from 'styles/NotiItemDesktop.module.scss';
import { MaterialIcon } from 'components/common';

export default ({ noti, edit, close, remove, login }) => {

    const { text } = noti;

    return (
        <div className={styles.NotiItemDesktop}>
            <div className={styles.icon}>
                <MaterialIcon>info</MaterialIcon>
            </div>
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