import React from 'react';
import styles from '../styles/MaterialIcon.module.scss';
import classnames from '../lib/classnames';

export default ({ children, md10, md15, md36, md48 }) => {
    return (
        <div className={classnames([
                styles.MaterialIcon, 
                md10 && styles.MaterialIcon__md10,
                md15 && styles.MaterialIcon__md15,
                md36 && styles.MaterialIcon__md36,
                md48 && styles.MaterialIcon__md48
            ])}>
            {
                children
            }
        </div>
    );
}