import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiEditorDesktop, NotiEditorMobile } from 'components/noti';
import text from 'res/texts/NotiEditor.text.json';

export default ({ initialActive = false, refresh }) => {

    const [active, setActive] = useState(initialActive);
    const [notiKR, setNotiKR] = useState('');
    const [notiEN, setNotiEN] = useState('');

    return (
        <ResponsiveComponent 
            DesktopComponent={NotiEditorDesktop}
            MobileComponent={NotiEditorMobile}
            text={text}
            active={active}
            setActive={setActive}
            setNotiKR={setNotiKR}
            setNotiEN={setNotiEN}
        />
    )

}