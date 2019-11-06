import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import styles from '../styles/LoginPage.module.scss';
import Button from './Button';
import { login } from '../api/auth';
import * as AuthActions from '../store/modules/auth';
import * as LayoutActions from '../store/modules/layout';
import Text from '../res/texts/LoginPage.text.json';
import useLanguages from '../lib/hooks/useLanguages';

const getInitialLoginErrorMsg = (query) => {
    switch (query.state) {
        case 'logout':
            return 'errormsg_logout';
        default:
            return '';
    }
}

export default ({ location }) => {

    /* Parse query string */
    const { search } = location;
    const query = queryString.parse(search);

    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [loginErrorMsg, setLoginErrorMsg] = useState(getInitialLoginErrorMsg(query));
    const [text] = useLanguages(Text);

    const onLogin = async () => {
        await login({ password })
            .then(
                (res) => {
                    dispatch(AuthActions.SetLogin(true));
                    dispatch(LayoutActions.CloseMobileHeader());
                }
            )
            .catch(
                (err) => {
                    if (err.response) {
                        const { msg } = err.response.data;
                        switch (msg) {
                            case 'password field required':
                                setLoginErrorMsg('errormsg_emptypwd');
                                break;
                            case 'wrong password':
                                setLoginErrorMsg('errormsg_wrongpwd');
                                break;
                            case 'server error':
                                setLoginErrorMsg('errormsg_servererr');
                                break;
                            default:
                                setLoginErrorMsg('errormsg_servererr');
                                break;
                        }
                    }
                    else {
                        setLoginErrorMsg('errormsg_connecterr');
                    }
                    
                }
            );
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginPage__header}> 
                { text.header }
            </div>
            <input className={styles.LoginPage__input}
                type="password"
                placeholder={text.input_placeholder}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { e.keyCode === 13 && onLogin(); }}
            />
            <span className={styles.LoginPage__input_error}>
                { text[loginErrorMsg] }
            </span>
            <div className={styles.LoginPage__button}>
                <Button onClick={onLogin} fillParent>{ text.button }</Button>
            </div>
        </div>
    );
}