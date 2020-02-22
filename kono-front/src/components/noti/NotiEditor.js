import React, { useState } from 'react';
import styles from 'styles/NotiEditor.module.scss';
import { MaterialIcon } from 'components/common';
import classnames from 'lib/classnames';

const TRANSITION_ANIMATION_DELAY_MS = 300;

export default ({ initialActive = false }) => {

    const [active, setActive] = useState(initialActive);
    const [activeStyle, setActiveStyle] = useState(initialActive);

    const onClickIcon = () => {
        if (!active) {
            setActive(true);
            setActiveStyle(true);
        }
    }
    const onClickExit = () => {
        setActiveStyle(false);
        setTimeout(() => setActive(false), TRANSITION_ANIMATION_DELAY_MS)
    };

    return (
        <div className={styles.NotiEditor}>
            <div className={classnames([
                styles.non_active,
                styles.container,
                activeStyle && styles.active
            ])}>
                <div className={classnames([
                    styles.icon,
                    styles.clickable
                ])} onClick={onClickIcon}>
                    {
                        <MaterialIcon>
                            {
                                active
                                ? 'check_circle_outline'
                                : 'add_circle_outline'
                            }
                        </MaterialIcon>
                    }
                </div>
                {
                    active && (
                        <div className={classnames([styles.item, styles.edit_wrapper])}>
                            <p>적을 내용</p>
                            <p>Some Stuff</p>
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