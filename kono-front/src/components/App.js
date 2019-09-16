import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import PostPage from './PostPage';
import CreditPage from './CreditPage';
import Header from './Header';
import Footer from './Footer';

export default () => {

    return (
        <>
            <Header />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/post/:post_id" component={PostPage} />
                <Route path="/credit" component={CreditPage} />
                <Route component={() => <Redirect to="/" />} />
            </Switch>
            <Footer />
        </>
    );
    
}