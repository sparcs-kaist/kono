import React from 'react';
import styles from 'styles/MaterialIcon.module.scss';
import classnames from 'lib/classnames';

export default ({ children, md10, md15, md20, md36, md48, style }) => {
    return (
        <div 
            className={classnames([
                styles.MaterialIcon, 
                md10 && styles.MaterialIcon__md10,
                md15 && styles.MaterialIcon__md15,
                md20 && styles.MaterialIcon__md20,
                md36 && styles.MaterialIcon__md36,
                md48 && styles.MaterialIcon__md48
            ])}
            style={style}
        >
            {
                children
            }
        </div>
    );
}