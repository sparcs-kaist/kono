import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiItemDesktop, NotiItemMobile, NotiEditor } from 'components/noti';
import { useLanguages } from 'lib/hooks';

export default ({ noti, refresh, ...rest }) => {

    const { noti_kr: notiKR, noti_en: notiEN } = noti;

    const [edit, setEdit] = useState(false);
    const [text] = useLanguages({ kr: notiKR, en: notiEN });

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