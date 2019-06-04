import React from 'react';
import styles from '../styles/LoginPage.module.scss';
import * as authAPI from '../api/auth';

const onLogin = async () => {
    const res = await authAPI.check();
    console.log(res);
}

export default () => {
    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginPage__header}> 
                학생복지위원회 관리자용 로그인
            </div>
            <input className={styles.LoginPage__input}
                type="password"
                placeholder="비밀번호"
            />
            <span className={styles.LoginPage__input_error}>
                로그인 에러
            </span>
            <div
                className={styles.LoginPage__button}
                onClick={onLogin}>
                로그인
            </div>
            <span className={styles.LoginPage__footer}>
                비밀번호 분실 시 SPARCS 개발진에게 연락 바랍니다.
            </span>
        </div>
    );
}