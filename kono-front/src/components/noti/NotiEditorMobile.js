import React, { useState } from 'react';
import styles from 'styles/NotiEditorMobile.module.scss';
import { MaterialIcon, Input, Spinner } from 'components/common';
import classnames from 'lib/classnames';

const TRANSITION_ANIMATION_DELAY_MS = 300;

export default ({ text, active, setActive, setNotiKR, setNotiEN, 
    onSubmit, submitLoading, submitErrorMsg, setSubmitErrorKey }) => {

    const [activeStyle, setActiveStyle] = useState(active);

    const onClickIcon = () => {
        if (!active) {
            setActive(true);
            setActiveStyle(true);
            setNotiKR('');
            setNotiEN('');
        }
    };

    const onExit = () => {
        setActiveStyle(false);
        setTimeout(() => {
            setActive(false);
            setSubmitErrorKey(null);
        }, TRANSITION_ANIMATION_DELAY_MS)
    };

    const onClickSubmit = () => {
        if (!submitLoading)
            onSubmit(onExit);
    }

    return (
        <div className={styles.NotiEditorMobile}>
            <div className={classnames([
                styles.container,
                activeStyle && styles.active,
                !activeStyle && styles.non_active,
            ])} onClick={onClickIcon}>
                {
                    !active && (
                        <div className={styles.button}>
                            <MaterialIcon>add</MaterialIcon>
                        </div>
                    )
                }
                {
                    active && (
                        <>
                            <Input placeholder={text.input_placeholder_kr} setValue={setNotiKR}/>
                            <Input placeholder={text.input_placeholder_en} setValue={setNotiEN}/>
                            { submitErrorMsg && <span>{ submitErrorMsg }</span> }
                            <div className={styles.button_wrapper}>
                                <div className={classnames([styles.button, styles.background])}
                                    onClick={onClickSubmit}>
                                    {
                                        submitLoading
                                        ? ( <Spinner small /> )
                                        : ( <MaterialIcon>check</MaterialIcon> )
                                    }
                                </div>
                                <div className={classnames([styles.button, styles.background])}
                                    onClick={onExit}>
                                    <MaterialIcon>clear</MaterialIcon>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )

}