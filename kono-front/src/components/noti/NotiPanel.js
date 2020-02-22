import React from 'react';
import { useSelector } from 'react-redux';
import { NotiItem, NotiEditor } from 'components/noti';

export default ({ notis }) => {

    const login = useSelector(state => state.auth.login, []);

    return (
        <div>
            {
                // login && <NotiEditor />
                <NotiEditor />
            }
            {
                notis.map(noti => {
                    const { sid } = noti;
                    return (
                        <NotiItem
                            key={`noti-item-${sid}`}
                            noti={noti}
                        />
                    );
                })
            }
        </div>
    );

}