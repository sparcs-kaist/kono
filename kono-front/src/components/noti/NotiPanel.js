import React from 'react';
import styles from 'styles/NotiPanel.module.scss';
import { useSelector } from 'react-redux';
import { NotiItem, NotiEditor } from 'components/noti';

export default ({ notis, refresh, closeNoti }) => {

    const login = useSelector(state => state.auth.login, []);

    return (
        <div className={styles.NotiPanel}>
            {
                login && <NotiEditor refresh={refresh}/>
            }
            {
                notis.map(noti => {
                    const { sid } = noti;
                    const close = () => {
                        if (closeNoti)
                            closeNoti(sid);
                    };
                    return (
                        <NotiItem
                            key={`noti-item-${sid}`}
                            noti={noti}
                            close={close}
                            login={login}
                        />
                    );
                })
            }
        </div>
    );

}