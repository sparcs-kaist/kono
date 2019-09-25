import React from 'react';
import styles from '../styles/Button.module.scss';

export default ({ children, onClick, round, fillParent }) => {

    return (
        <div 
            className={[
                styles.Button, 
                round && styles.Button__round,
                fillParent && styles.Button__fill_parent
            ]
                .filter(e => !!e)
                .join(' ')}
            onClick={onClick}>
            { children }
        </div>
    )

}