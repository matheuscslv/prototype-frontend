import React from 'react';
import {
  Switch, Route,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';

import Unidade from '../pages/Unidade';
import Funcao from '../pages/Funcao';
import PageError from '../pages/PageError';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Redirect to="/unidade" />
      </Route>
      <Route exact path="/unidade" component={Unidade} />
      <Route exact path="/funcao" component={Funcao} />
      <Route path="*" component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
