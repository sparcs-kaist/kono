import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/NoticePanelMobile.module.scss';
import { PanelHeader } from 'components/landing';

export default ({
    text
}) => {

    return (
        <div className={styles.NoticePanelMobile}>
            <PanelHeader title={text.title}/>
        </div>
    )

}