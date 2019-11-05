import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/App.module.scss';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import PostPage from './PostPage';
import CreditPage from './CreditPage';
import Header from './Header';
import Footer from './Footer';
import { check } from '../api/auth';
import * as AuthAPI from '../store/modules/auth';
import * as ConfigActions from '../store/modules/config';

export default () => {

    const dispatch = useDispatch();

    /* Set configuration as currently saved in browser LocalStorage. */
    useEffect(() => {
        dispatch(ConfigActions.SetToLocalStorageTheme());
        dispatch(ConfigActions.SetToLocalStorageLanguage());
    }, [dispatch]);

    /* Check login status when app is loaded */
    useEffect(() => {
        const checkLoginStatus = async () => await check()
                .then(
                    () => { dispatch(AuthAPI.SetLogin(true)) },
                    () => {}
                );

        checkLoginStatus();

    }, [dispatch]);

    const login = useSelector(state => state.auth.login, []);
    const theme = useSelector(state => state.config.theme, []);

    return (
        <div className={`${theme} ${styles.App}`}>
            <Header />
            <div className={styles.App__wrapper}>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/login" component={login ? () => <Redirect to="/" /> : LoginPage} />
                    <Route path="/post/:post_id" component={PostPage} />
                    <Route path="/credit" component={CreditPage} />
                    <Route component={() => <Redirect to="/" />} />
                </Switch>
            </div >
            <Footer />
        </div>
    );
    
}