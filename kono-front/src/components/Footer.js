import React from 'react';
import styles from '../styles/Footer.module.scss';
import { ReactComponent as SPARCSLogo } from '../res/sparcs_logo.svg';
import { ReactComponent as SWCLogo } from '../res/SWC_logo.svg';

export default () => {
    return (
        <div className={styles.Footer}>
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
            <div className={styles.Footer__credit}>Credit</div>
            <div className={styles.Footer__license}>License</div>
            <div className={styles.Footer__contact}>Contact</div>
        </div>
    )
}