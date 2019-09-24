import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/App.module.scss';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import PostPage from './PostPage';
import CreditPage from './CreditPage';
import WritePage from './WritePage';
import Header from './Header';
import Footer from './Footer';
import { check } from '../api/auth';
import * as AuthAPI from '../store/modules/auth';

export default () => {

    const dispatch = useDispatch();

    /* Check login status when app is loaded */
    useEffect(() => {

        const checkLoginStatus = async () => await check()
                .then(
                    () => { dispatch(AuthAPI.SetLogin('logged')) },
                    () => { dispatch(AuthAPI.SetLogin('rejected')) }
                );

        checkLoginStatus();

    }, [dispatch]);

    const login = useSelector(state => state.auth.login, []);
    const theme = useSelector(state => state.config.theme, []);

    return (
        <div className={`${theme} ${styles.App}`}>
            <Header />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={login === 'logged' ? () => <Redirect to="/" /> : LoginPage} />
                <Route path="/post/:post_id" component={PostPage} />
                <Route path="/credit" component={CreditPage} />
                <Route path="/write" component={WritePage} />
                <Route component={() => <Redirect to="/" />} />
            </Switch>
            <Footer />
        </div>
    );
    
}