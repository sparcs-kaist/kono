import React from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';
import Text from '../res/texts/Header.text.json';
import useLanguages from '../lib/hooks/useLanguages';
import useWindowDimension from '../lib/hooks/useWindowDimension';
import * as AuthActions from '../store/modules/auth';
import * as ConfigActions from '../store/modules/config';
import { logout } from '../api/auth';

export default withRouter(({ history }) => {

    const dispatch = useDispatch();
    const login = useSelector(state => state.auth.login, []);
    const [text] = useLanguages(Text);
    const { width } = useWindowDimension();

    const showDesktopHeader = width >= 800;

    const onLogout = async () => await logout()
        .then(
            () => {
                dispatch(AuthActions.Logout());
                history.push('/login?state=logout');
            }
        );
    const onToggleTheme = () => { dispatch(ConfigActions.ToggleTheme()); }
    const onToggleLanguage = () => { dispatch(ConfigActions.ToggleLanguage()); }

    return showDesktopHeader ? (
        <HeaderDesktop
            text={text}
            login={login}
            onToggleTheme={onToggleTheme}
            onToggleLanguage={onToggleLanguage}
            onLogout={onLogout}
        />
    ) : (
        <HeaderMobile 
            text={text}
            login={login}
            onToggleTheme={onToggleTheme}
            onToggleLanguage={onToggleLanguage}
            onLogout={onLogout}
        />
    )
})