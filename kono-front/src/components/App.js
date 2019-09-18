import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import LostFoundPage from './LostFoundPage';
import NoticePage from './NoticePage';
import CreditPage from './CreditPage';
import Header from './Header';
import Footer from './Footer';
import { check } from '../api/auth';
import * as AuthAPI from '../store/modules/auth';

export default () => {

    const dispatch = useDispatch();

    /* Check login status when app is loaded */
    useEffect(() => {

        const checkLoginStatus = async () => await check()
                .then(() => dispatch(AuthAPI.SetLogin(true)));

        checkLoginStatus();

    }, [dispatch]);

    const login = useSelector(state => state.auth.login, []);

    return (
        <>
            <Header />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={login ? () => <Redirect to="/"/> : LoginPage} />
                <Route path="/notice" component={NoticePage} />
                <Route path="/lostfound" component={LostFoundPage} />
                <Route path="/credit" component={CreditPage} />
                <Route component={() => <Redirect to="/" />} />
            </Switch>
            <Footer />
        </>
    );
    
}