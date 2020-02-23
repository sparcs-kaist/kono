import React, { useState } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NotiEditorDesktop, NotiEditorMobile } from 'components/noti';
import * as NotiAPI from 'api/noti';
import { useLanguages } from 'lib/hooks';
import Text from 'res/texts/NotiEditor.text.json';

export default ({ initialActive = false, refresh, noti, exit }) => {

    const { sid, noti_kr: _notiKR = '', noti_en: _notiEN = '' } = noti || {};

    const [active, setActive] = useState(initialActive);
    const [notiKR, setNotiKR] = useState(_notiKR);
    const [notiEN, setNotiEN] = useState(_notiEN);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitErrorKey, setSubmitErrorKey] = useState(null);

    const [text] = useLanguages(Text);

    const onSubmit = async (onSuccess, onFailure) => {
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
                if (refresh)
                    refresh();
                if (onSuccess)
                    onSuccess();
            })
            .catch((err) => {
                setSubmitLoading(false);
                if (onFailure)
                    onFailure(err);
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
            exit={exit}
            active={active}
            setActive={setActive}
            initialNotiKR={_notiKR}
            initialNotiEN={_notiEN}
            setNotiKR={setNotiKR}
            setNotiEN={setNotiEN}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            submitErrorMsg={submitErrorMsg}
            setSubmitErrorKey={setSubmitErrorKey}
        />
    )

}