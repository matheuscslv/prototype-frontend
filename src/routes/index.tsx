import React from 'react';
import {
  Switch, Route,
  BrowserRouter as Router, Redirect,
} from 'react-router-dom';

import Login from "../pages/Login";

import Routes from './route';

import { useAuth } from '../hooks/auth';

// @ts-ignore
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { signed } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => (
        signed ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      )}
    />
  );
};

const Main = () => (
  <Router>
    <Switch>
      <Route path="/login" component={Login} />
      <PrivateRoute path="/" component={Routes} />
    </Switch>
  </Router>
);

export default Main;
