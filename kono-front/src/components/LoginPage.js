import React from 'react';
import styles from '../styles/LoginPage.module.scss';

export default () => {
    return (
        <div className={styles.LandingPage}>
            <div>
                학생복지위원회 관리자 로그인
            </div>
            <input
                type="password"
                placeholder="비밀번호"
            />
            <span>
                input_error
            </span>
            <div>
                로그인
            </div>
            <span>
                비밀번호 분실 시 SPARCS 개발진에게 연락 바랍니다.
            </span>
        </div>
    );
}