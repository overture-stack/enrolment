import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';

import serviceWorkerRegister from './registerServiceWorker';
import configureStore from './redux/store';

import { PrivateRoute, OnlyNonLoggedInRoute } from './routeHelpers';

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
serviceWorkerRegister();

// Create redux store
const store = configureStore();

render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <OnlyNonLoggedInRoute exact path="/" component={Login} />
          <OnlyNonLoggedInRoute exact path="/register-user/:id" component={Login} />
          <OnlyNonLoggedInRoute exact path="/login" component={Login} />
          <Main>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/register/project" component={RegisterProject} />
              <PrivateRoute exact path="/register/user/:id" component={RegisterUser} />
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
