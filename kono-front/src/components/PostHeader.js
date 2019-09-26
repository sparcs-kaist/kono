import React from 'react';
import styles from '../styles/PostHeader.module.scss';

export default ({ header }) => {

    const { type, title, date } = header;

    return (
        <div className={styles.PostHeader}>
            <h1>{ title }</h1>
            <div className={styles.PostHeader__tags}>
                <span><b>{ type }</b></span>
                <span>{ date }</span>
            </div>
        </div>
    )

}