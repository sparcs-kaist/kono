import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../styles/LoginPage.module.scss';
import { login } from '../api/auth';
import * as AuthActions from '../store/modules/auth';

export default () => {

    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [loginErrorMsg, setLoginErrorMsg] = useState('');

    const onLogin = async () => {
        await login({ password })
            .then(
                () => {
                    dispatch(AuthActions.SetLogin(true));
                    setLoginErrorMsg('');
                },
                (err) => {
                    const { msg } = err.response.data;
                    switch (msg) {
                        case 'password field required':
                            setLoginErrorMsg('비밀번호를 입력해 주세요.');
                            break;
                        case 'wrong password':
                            setLoginErrorMsg('비밀번호가 올바르지 않습니다.');
                            break;
                        case 'server error':
                            setLoginErrorMsg('서버 에러');
                            break;
                        default:
                            setLoginErrorMsg('서버 에러');
                            break;
                    }
                }
            );
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginPage__header}> 
                학생복지위원회 관리자용 로그인
            </div>
            <input className={styles.LoginPage__input}
                type="password"
                placeholder="비밀번호"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { e.keyCode === 13 && onLogin(); }}
            />
            <span className={styles.LoginPage__input_error}>
                { loginErrorMsg }
            </span>
            <div
                className={styles.LoginPage__button}
                onClick={onLogin}
            >
                로그인
            </div>
        </div>
    );
}