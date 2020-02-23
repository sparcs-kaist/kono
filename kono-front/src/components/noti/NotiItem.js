import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiItemDesktop, NotiItemMobile, NotiEditor } from 'components/noti';
import { useLanguages } from 'lib/hooks';

export default ({ noti, refresh, ...rest }) => {

    const { noti_kr: notiKR, noti_en: notiEN } = noti;
    const _noti = {
        kr: notiKR ? notiKR : notiEN,
        en: notiEN ? notiEN : notiKR
    };

    const [edit, setEdit] = useState(false);
    const [text] = useLanguages(_noti);

    return edit
    ? (
        <NotiEditor initialActive refresh={refresh} noti={noti} 
            exit={() => setEdit(false)}/>
    )
    : (
        <ResponsiveComponent 
            DesktopComponent={NotiItemDesktop}
            MobileComponent={NotiItemMobile}
            noti={{ ...noti, text }}
            edit={() => setEdit(true)}
            {...rest}
        />
    )

}