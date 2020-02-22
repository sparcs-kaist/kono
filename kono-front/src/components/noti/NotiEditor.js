import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiEditorDesktop } from 'components/noti';

export default ({ initialActive = false }) => {

    const [active, setActive] = useState(initialActive);
    const [notiKR, setNotiKR] = useState('');
    const [notiEN, setNotiEN] = useState('');

    return (
        <ResponsiveComponent 
            DesktopComponent={NotiEditorDesktop}
            MobileComponent={() => null}
            active={active}
            setActive={setActive}
            setNotiKR={setNotiKR}
            setNotiEN={setNotiEN}
        />
    )

}