import React from 'react';
import styles from '../styles/PostHeader.module.scss';

function typeToString(type) {
    switch (type) {
        case 'notice':
            return '공지사항';
        case 'lostfound':
            return '분실물';
        default:
            return '게시물';
    }
}

function dateToString(date) {
    return date.toLocaleString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export default ({ header }) => {

    const { type, title, date } = header;

    return (
        <div className={styles.PostHeader}>
            <h1>{ title }</h1>
            <div className={styles.PostHeader__tags}>
                <span><b>{ typeToString(type) }</b></span>
                <span>{ dateToString(date) }</span>
            </div>
        </div>
    )

}