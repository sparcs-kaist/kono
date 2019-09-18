import React from 'react';
import styles from '../styles/Footer.module.scss';
import { ReactComponent as SPARCSLogo } from '../res/sparcs_logo.svg';
import { ReactComponent as SWCLogo } from '../res/SWC_logo.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default () => {

    const login = useSelector(state => state.auth.login, []);

    return (
        <div className={styles.Footer}>
            <div className={styles.Footer__logo}>
                <div className={styles.Footer__sparcs_logo}>
                    <a href="https://sparcs.org">
                        <SPARCSLogo />
                    </a>
                </div>
                <div className={styles.Footer__cross}>X</div>
                <div className={styles.Footer__swc_logo}>
                    <a href="https://welfare.kaist.ac.kr/">
                        <SWCLogo />
                    </a>
                </div>
                <span className={styles.Footer__menu}>
                    <Link to="/credit">
                        Credit
                    </Link>
                </span>
            </div>
            <span className={styles.Footer__menu}>
                <a href="https://mit-license.org">
                    License
                </a>
            </span>
            {
                    !login && (
                        <span className={styles.Footer__common_menu}>
                            <Link to="/login">
                                관리자 로그인
                            </Link>
                        </span>
                    )
                }
            <span className={styles.Footer__common_menu}>
                Contact
            </span>
        </div>
    )
}