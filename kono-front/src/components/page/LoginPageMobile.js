import React from 'react';
import styles from 'styles/LoginPageMobile.module.scss';
import { Button } from 'components/common';

export default ({ 
    text, loginErrorMsg, 
    onChangePassword, onKeyDown, onLogin 
}) => {

    return (
        <div className={styles.LoginPageMobile}>
            <div className={styles.LoginPageMobile__header}> 
                { text.header }
            </div>
            <input className={styles.LoginPageMobile__input}
                type="password"
                placeholder={text.input_placeholder}
                onChange={onChangePassword}
                onKeyDown={onKeyDown}
            />
            <span className={styles.LoginPageMobile__input_error}>
                { text[loginErrorMsg] }
            </span>
            <div className={styles.LoginPageMobile__button}>
                <Button onClick={onLogin} fillParent>{ text.button }</Button>
            </div>
        </div>
    );
}