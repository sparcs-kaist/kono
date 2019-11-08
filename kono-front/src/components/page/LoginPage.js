import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { LoginPageDesktop, LoginPageMobile } from 'components/page';
import { login } from 'api/auth';
import * as AuthActions from 'store/modules/auth';
import * as LayoutActions from 'store/modules/layout';
import Text from 'res/texts/LoginPage.text.json';
import { useLanguages, useWindowDimension } from 'lib/hooks';

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
    const { width } = useWindowDimension();

    const showDesktopPage = width >= 600;

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

    const onChangePassword = (e) => { setPassword(e.target.value); };
    const onKeyDown = (e) => { e.keyCode === 13 && onLogin(); };

    return showDesktopPage ? (
        <LoginPageDesktop 
            text={text}
            loginErrorMsg={loginErrorMsg}
            onChangePassword={onChangePassword}
            onKeyDown={onKeyDown}
            onLogin={onLogin}
        />
    ) : (
        <LoginPageMobile 
            text={text}
            loginErrorMsg={loginErrorMsg}
            onChangePassword={onChangePassword}
            onKeyDown={onKeyDown}
            onLogin={onLogin}
        />
    )
}