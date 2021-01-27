import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { unregister } from './registerServiceWorker';
import configureStore from './redux/store';

import { PrivateRoute, OnlyNonLoggedInRoute } from './routeHelpers';

import './i18n';

import {
  App,
  Login,
  Main,
  Dashboard,
  Projects,
  RegisterProject,
  RegisterUser,
  NotFound,
} from './modules';

// Service Worker for PWA
unregister();

// Create redux store
const store = configureStore();

render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <OnlyNonLoggedInRoute exact path="/" component={Login} />
          <OnlyNonLoggedInRoute exact path="/register-user/:projectId/:userId" component={Login} />
          <OnlyNonLoggedInRoute exact path="/login" component={Login} />
          <Main>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/register/project" component={RegisterProject} />
              <PrivateRoute exact path="/view/project/:id" component={RegisterProject} />
              <PrivateRoute
                exact
                path="/register/user/:projectId/:userId"
                component={RegisterUser}
              />
              <PrivateRoute
                exact
                path="/view/project-user/:projectId/:userId"
                component={RegisterUser}
              />
              <PrivateRoute exact path="/projects" component={Projects} />
              <PrivateRoute component={NotFound} />
            </Switch>
          </Main>
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
