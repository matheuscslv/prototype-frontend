import React from 'react';
import {
  Switch, Route,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';

import Home from '../pages/Home';
import PageError from '../pages/PageError';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route exact path="/home" component={Home} />
      <Route path="*" component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
