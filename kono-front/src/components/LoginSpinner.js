import React from 'react';
import styles from '../styles/LoginSpinner.module.scss';
import { ReactComponent as SpinnerSVG } from '../res/icons/spinner.svg';

export default () => {

    return (
        <div className={styles.LoginSpinner}>
            <SpinnerSVG />
            <div className={styles.LoginSpinner__text}>
                로그인 여부 확인 중...
            </div>
        </div>
    )

}