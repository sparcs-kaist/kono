import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as Logo } from '../res/logo.svg';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div className={styles.Header}>
            <div className={styles.Header__bar}></div>
            <div className={styles.Header__logo}>
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            <div className={styles.Header__link}>
                환불신청
            </div>
            <div className={styles.Header__login}>
                <Link to="/login">
                    로그인
                </Link>
            </div>
        </div>
    )
}