import React from 'react';
import styles from '../styles/Button.module.scss';
import classnames from '../lib/classnames';

export default ({ children, onClick, round, fillParent }) => {

    return (
        <div 
            className={classnames([
                styles.Button, 
                round && styles.Button__round,
                fillParent && styles.Button__fill_parent
            ])}
            onClick={onClick}>
            { children }
        </div>
    )

}