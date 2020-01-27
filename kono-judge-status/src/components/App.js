import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LandingPage } from 'components/page';
import { WebsocketProvider, DataProvider } from 'components/provider';

export default () => {
  return (
    <WebsocketProvider>
      <DataProvider>
        <div className="App">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route component={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </DataProvider>
    </WebsocketProvider>
  );
}
