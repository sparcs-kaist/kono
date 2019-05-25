import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as Logo } from '../res/logo.svg';

export default () => {
    return (
        <div className={styles.Header}>
            <div className={styles.Header__bar}></div>
            <div className={styles.Header__logo}>
                <Logo />
            </div>
            <div className={styles.Header__link}>
                환불신청
            </div>
        </div>
    )
}