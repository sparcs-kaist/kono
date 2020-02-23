import React, { useState, useEffect } from 'react';
import styles from 'styles/NotiPanel.module.scss';
import { useSelector } from 'react-redux';
import { NotiItem, NotiEditor } from 'components/noti';
import * as NotiAPI from 'api/noti';
import storage from 'lib/browser/storage';

const STORAGE_KEY_NOTI_FILTER = '__NOTI_FILTER__';
const NOTI_REFRESH_COOLDOWN = 24*60*60*1000;

export default ({ notis, refresh }) => {

    const login = useSelector(state => state.auth.login, []);

    const [notiFilter, setNotiFilter] = useState([]);
    const [filteredNotis, setFilteredNotis] = useState([]);

    const refreshNotiFilter = () => {
        const _notiFilter = storage.get(STORAGE_KEY_NOTI_FILTER);
        if (_notiFilter)
            setNotiFilter(_notiFilter);
    };

    const closeNoti = (closeSID) => {
        const updatedNotiFilter = notiFilter.filter(({ sid }) => (sid !== closeSID));
        updatedNotiFilter.push({ sid: closeSID, timestamp: Date.now() });
        storage.set(STORAGE_KEY_NOTI_FILTER, updatedNotiFilter);
        refreshNotiFilter();
    };

    const deleteNoti = async (sid) => {
        await NotiAPI.remove(sid);
        refresh();
    }

    useEffect(refreshNotiFilter, []);
    useEffect(() => {
        const filterNotis = ({ sid }) => notiFilter.every(({ sid: filterSID, timestamp }) => {
            return (sid !== filterSID) || (timestamp + NOTI_REFRESH_COOLDOWN < Date.now());
        });
        setFilteredNotis(notis.filter(filterNotis));
    }, [notis, notiFilter]);

    return (
        <div className={styles.NotiPanel}>
            {
                login && <NotiEditor refresh={refresh}/>
            }
            {
                filteredNotis.map(noti => {
                    const { sid } = noti;
                    const close = () => {
                        if (closeNoti)
                            closeNoti(sid);
                    };
                    const remove = () => deleteNoti(sid);
                    return (
                        <NotiItem
                            key={`noti-item-${sid}`}
                            noti={noti}
                            login={login}
                            close={close}
                            remove={remove}
                        />
                    );
                })
            }
        </div>
    );

}