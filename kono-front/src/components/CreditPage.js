import React from 'react';
import styles from '../styles/CreditPage.module.scss';

export default () => {
    return (
        <div className={styles.CreditPage}>
            <h2>2019 Spring, SPARCS kono Team</h2>
            <h3>Developers</h3>
            <p>국윤범(zackie)</p>
            <p>안병서(gogi)</p>
            <p>황동욱(inhibitor)</p>
            <h3>Designers</h3>
            <p>임현정(zero)</p>
            <h2>Special Thanks To:</h2>
            <p>이택경</p>
            <p>임성준</p>
        </div>
    );
}