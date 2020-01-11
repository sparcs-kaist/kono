import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LandingPage } from 'components/page';

export default () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}
