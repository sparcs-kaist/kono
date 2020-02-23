import React from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiItemDesktop, NotiItemMobile } from 'components/noti';
import { useLanguages } from 'lib/hooks';

export default ({ noti, ...rest }) => {

    const { noti_kr: notiKR, noti_en: notiEN } = noti;

    const [text] = useLanguages({ kr: notiKR, en: notiEN });

    return (
        <ResponsiveComponent 
            DesktopComponent={NotiItemDesktop}
            MobileComponent={NotiItemMobile}
            noti={{ ...noti, text }}
            {...rest}
        />
    )

}