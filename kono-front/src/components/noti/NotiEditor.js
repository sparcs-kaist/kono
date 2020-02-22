import React from 'react';
import styles from 'styles/NotiEditor.module.scss';
import { MaterialIcon } from 'components/common';
import classnames from 'lib/classnames';

export default ({ active }) => {

    return (
        <div className={styles.NotiEditor}>
            {
                !active && (
                    <div className={classnames([
                        styles.non_active,
                        styles.container
                    ])}>
                        <div className={classnames([
                            styles.icon,
                            styles.clickable
                        ])}>
                            <MaterialIcon>add</MaterialIcon>
                        </div>
                    </div>
                )
            }
        </div>
    );

}