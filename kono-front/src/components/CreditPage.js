import React from 'react';
import styles from '../styles/CreditPage.module.scss';
import { ReactComponent as Logo } from '../res/icons/logo.svg';

export default () => {
    return (
        <div className={styles.CreditPage}>
            <Logo width={100} height={100}/>
            <h3>Project Manager</h3>
            <a href="https://github.com/inhibitor1217">
                <span>황동욱</span>
            </a>
            <p>(2019.4 ~ )</p>
            <h3>Developers</h3>
            <div className={styles.CreditPage__row}>
                <span>국윤범</span>
                <span>김태원</span>
            </div>
            <div className={styles.CreditPage__row}>
                <span>나선일</span>
                <span>안병서</span>
            </div>
            <div className={styles.CreditPage__row}>
                <span>한우현</span>
                <span>황동욱</span>
            </div>
            <h3>Designers</h3>
            <span>임현정</span>
            <h3>Special Thanks To:</h3>
            <div className={styles.CreditPage__row}>
                <span>이택경</span>
                <span>임성준</span>
            </div>
        </div>
    );
}