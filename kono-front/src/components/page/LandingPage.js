import React from 'react';
import styles from 'styles/LandingPage.module.scss';
import { RoomPanel } from 'components/room';
import classnames from 'lib/classnames';

export default () => {

    return (
        <div className={styles.LandingPage}>
            <div className={classnames([
                styles.LandingPage__container
            ])}>
                <div className={classnames([
                    styles.LandingPage__item,
                    styles.LandingPage__item_single
                ])}>
                    <RoomPanel />
                </div>
            </div>
        </div>
    );

}