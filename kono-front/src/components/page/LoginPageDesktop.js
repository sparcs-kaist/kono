import React from 'react';
import styles from 'styles/LoginPageDesktop.module.scss';
import { Button } from 'components/common';

export default ({ 
    text, loginErrorMsg, 
    onChangePassword, onKeyDown, onLogin 
}) => {

    return (
        <div className={styles.LoginPageDesktop}>
            <div className={styles.LoginPageDesktop__header}> 
                { text.header }
            </div>
            <input className={styles.LoginPageDesktop__input}
                type="password"
                placeholder={text.input_placeholder}
                onChange={onChangePassword}
                onKeyDown={onKeyDown}
            />
            <span className={styles.LoginPageDesktop__input_error}>
                { text[loginErrorMsg] }
            </span>
            <div className={styles.LoginPageDesktop__button}>
                <Button onClick={onLogin} fillParent>{ text.button }</Button>
            </div>
        </div>
    );
}