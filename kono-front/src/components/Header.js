import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as Logo } from '../res/logo.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as AuthActions from '../store/modules/auth';
import { logout } from '../api/auth';

export default () => {

    const login = useSelector(state => state.auth.login, []);

    const onLogout = async () => await logout().then(() => AuthActions.Logout());

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
                {
                    login && (
                        <>
                            <span className={styles.Header__common_menu}>
                                관리자 서비스
                            </span>
                            <span className={styles.Header__common_menu} onClick={onLogout}>
                                로그아웃
                            </span>
                        </>
                    )
                }
                {
                    !login && (
                        <span className={styles.Header__common_menu}>
                            <Link to="/login">
                                관리자 로그인
                            </Link>
                        </span>
                    )
                }
            </div>
            
        </div>
    )
}