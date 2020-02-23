import React, { useState } from 'react';
import styles from 'styles/NotiEditorDesktop.module.scss';
import { MaterialIcon, Input, Spinner } from 'components/common';
import classnames from 'lib/classnames';

const TRANSITION_ANIMATION_DELAY_MS = 300;

export default ({ text, active, setActive, setNotiKR, setNotiEN, 
    onSubmit, submitLoading, submitErrorMsg, setSubmitErrorKey }) => {

    const [activeStyle, setActiveStyle] = useState(active);

    const onClickIcon = () => {
        if (active) {
            if (!submitLoading)
                onSubmit();
        }
        else {
            setActive(true);
            setActiveStyle(true);
        }
    }
    const onClickExit = () => {
        setActiveStyle(false);
        setTimeout(() => {
            setActive(false);
            setSubmitErrorKey(null);
        }, TRANSITION_ANIMATION_DELAY_MS)
    };

    return (
        <div className={styles.NotiEditorDesktop}>
            <div className={classnames([
                styles.container,
                activeStyle && styles.active,
                !activeStyle && styles.non_active,
            ])}>
                <div className={classnames([
                    styles.icon,
                    !submitLoading && styles.clickable
                ])} onClick={onClickIcon}>
                    {
                        submitLoading
                        ? <Spinner small/>
                        : (
                            <MaterialIcon>
                                {
                                    active
                                    ? 'check_circle_outline'
                                    : 'add_circle_outline'
                                }
                            </MaterialIcon>
                        )
                    }
                </div>
                {
                    active && (
                        <div className={classnames([styles.item, styles.edit_wrapper])}>
                            <Input placeholder={text.input_placeholder_kr} setValue={setNotiKR}/>
                            <Input placeholder={text.input_placeholder_en} setValue={setNotiEN}/>
                            { submitErrorMsg && <span>{ submitErrorMsg }</span> }
                        </div>
                    )
                }
                {
                    active && (
                        <div className={classnames([styles.item, styles.clickable])}
                            onClick={onClickExit}>
                            <MaterialIcon>clear</MaterialIcon>
                        </div>
                    )
                }
            </div>
        </div>
    );

}