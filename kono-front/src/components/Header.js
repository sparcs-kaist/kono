import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as Logo } from '../res/logo.svg';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div className={styles.Header}>
            <div className={styles.Header__bar}></div>
            <div className={styles.Header__content}>
                <span className={styles.Header__logo}>
                    <Link to="/">
                        <Logo />
                    </Link>
                </span>
                <span className={styles.Header__menu}>
                    <a href="https://docs.google.com/forms/d/1Wb33uCYDl4kAyg-_5lZ6n20ByJ-NhelUDOz_8_U5Y6w/edit">
                        환불신청
                    </a>
                </span>
                <span className={styles.Header__common_menu}>
                    <Link to="/login">
                        로그인
                    </Link>
                </span>
            </div>
            
        </div>
    )
}