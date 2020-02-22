import React from 'react';
import { NotiItemDesktop, NotiItemMobile } from 'components/noti';
import { useWindowDimension, useLanguages } from 'lib/hooks';

export default ({ noti }) => {

    const { noti_kr: notiKR, noti_en: notiEN } = noti;

    const { width } = useWindowDimension();
    const showDesktopLayout = width >= 800;

    const [text] = useLanguages({ kr: notiKR, en: notiEN });

    return (
        <>
            {
                showDesktopLayout
                ? <NotiItemDesktop noti={{ ...noti, text }} />
                : <NotiItemMobile  noti={{ ...noti, text }} />
            }
        </>
    )

}