import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiEditorDesktop, NotiEditorMobile } from 'components/noti';
import * as NotiAPI from 'api/noti';
import { useLanguages } from 'lib/hooks';
import Text from 'res/texts/NotiEditor.text.json';

export default ({ initialActive = false, refresh, sid }) => {

    const [active, setActive] = useState(initialActive);
    const [notiKR, setNotiKR] = useState('');
    const [notiEN, setNotiEN] = useState('');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitErrorKey, setSubmitErrorKey] = useState(null);

    const [text] = useLanguages(Text);

    const onSubmit = async () => {
        if (notiKR.length === 0 && notiEN.length === 0) {
            setSubmitErrorKey('submit_error_empty');
            return;
        }
        const body = { noti_kr: notiKR, noti_en: notiEN };
        const task = (
            sid
            ? NotiAPI.update(sid, body)
            : NotiAPI.create(body)
        );
        setSubmitLoading(true);
        await task
            .then((res) => {
                setSubmitLoading(false);
                refresh();
            })
            .catch((err) => {
                setSubmitLoading(false);
                if (err.response) {
                    const { msg } = err.response.data;
                    switch (err.response.status) {
                        case 400:
                            if (msg === 'invalid noti_kr')
                                setSubmitErrorKey('submit_error_invalid_kr');
                            else if (msg === 'invalid noti_en')
                                setSubmitErrorKey('submit_error_invalid_en');
                            else
                                setSubmitErrorKey('submit_error_server_error');
                            break;
                        case 403:
                                setSubmitErrorKey('submit_error_login');
                            break;
                        case 500:
                        default:
                                setSubmitErrorKey('submit_error_server_error');
                            break;
                    }
                }
                else {
                    setSubmitErrorKey('submit_error_connection');
                }
            });
    }

    const submitErrorMsg = submitErrorKey ? text[submitErrorKey] : '';

    return (
        <ResponsiveComponent 
            DesktopComponent={NotiEditorDesktop}
            MobileComponent={NotiEditorMobile}
            text={text}
            active={active}
            setActive={setActive}
            setNotiKR={setNotiKR}
            setNotiEN={setNotiEN}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            submitErrorMsg={submitErrorMsg}
            setSubmitErrorKey={setSubmitErrorKey}
        />
    )

}