import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import LostFoundPage from './LostFoundPage';
import NoticePage from './NoticePage';
import Header from './Header';
import Footer from './Footer';

export default () => {
    /*
    return (
        <>
            <Header />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/notice" component={NoticePage} />
                <Route path="/lostfound" component={LostFoundPage} />
                <Route component={() => <Redirect to="/" />} />
            </Switch>
            <Footer />
        </>
    );
    */
   return (
    <>
        <Header />
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route component={() => <Redirect to="/" />} />
        </Switch>
        <Footer />
    </>
);
}