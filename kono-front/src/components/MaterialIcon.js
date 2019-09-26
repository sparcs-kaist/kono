import React from 'react';
import styles from '../styles/MaterialIcon.module.scss';
import classnames from '../lib/classnames';

export default ({ children, large }) => {
    return (
        <div className={classnames([
            styles.MaterialIcon, 
            large && styles.MaterialIcon__large
            ])}>
            {
                children
            }
        </div>
    );
}