import React from 'react';
import styles from '../styles/Header.module.scss';
import { ReactComponent as Logo } from '../res/logo.svg';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthActions from '../store/modules/auth';
import * as ConfigActions from '../store/modules/config'; // TEMPORARY
import { logout } from '../api/auth';

export default withRouter(({ history }) => {

    const dispatch = useDispatch();
    const login = useSelector(state => state.auth.login, []);

    const onLogout = async () => await logout()
        .then(
            () => {
                dispatch(AuthActions.Logout());
                history.push('/login?state=logout');
            }
        );

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
                <span 
                    className={styles.Header__common_menu}
                    onClick={() => { dispatch(ConfigActions.ToggleTheme()) }}>
                    __TOGGLE_THEME__
                </span>
                {
                    login === 'logged' && (
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
            </div>
            
        </div>
    )
})