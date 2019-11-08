import React from 'react';
import styles from 'styles/PostHeader.module.scss';
import Text from 'res/texts/PostHeader.text.json';
import { useLanguages } from 'lib/hooks';

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

function getDateString(date) {
    return date.toLocaleString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export default (
    {
        type = 'post',
        title,
        date = new Date()
    }
) => {

    const showTitle = (title.kr || title.en);
    const [titleTranscripted] = (title.kr && title.en)
        ? useLanguages(title)
        : (title.kr ? title.kr : title.en);
    const [text] = useLanguages(Text);

    return (
        <div className={styles.PostHeader}>
            {
                showTitle && (<h1>{ titleTranscripted }</h1>)
            }
            <div className={styles.PostHeader__tags}>
                <span><b>{ text[getTypeSelector(type)] }</b></span>
                <span>{ getDateString(date) }</span>
            </div>
        </div>
    )

}