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
                <a href="https://docs.google.com/forms/d/1Wb33uCYDl4kAyg-_5lZ6n20ByJ-NhelUDOz_8_U5Y6w/edit">
                    환불신청
                </a>
            </div>
            <div className={styles.Header__login}>
                <Link to="/login">
                    로그인
                </Link>
            </div>
        </div>
    )
}