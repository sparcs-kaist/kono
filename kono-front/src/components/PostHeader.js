import React from 'react';
import styles from '../styles/PostHeader.module.scss';
import Text from '../res/texts/PostHeader.text.json';
import useLanguages from '../lib/hooks/useLanguages';

const getTypeSelector = (type) => {
    switch (type) {
        case 'notice':
            return 'type_notice';
        case 'lostfound':
            return 'type_lostfound';
        default:
            return 'type_default';
    }
}

export default ({ header }) => {

    const { type, title, date } = header;
    const titleTranscripted = useLanguages(title);
    const text = useLanguages(Text);

    return (
        <div className={styles.PostHeader}>
            <h1>{ titleTranscripted }</h1>
            <div className={styles.PostHeader__tags}>
                <span><b>{ text[getTypeSelector(type)] }</b></span>
                <span>{ date }</span>
            </div>
        </div>
    )

}