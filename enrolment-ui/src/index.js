import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import 'bootstrap/dist/css/bootstrap.min.css';

import { getOneConfig } from './config';
import reportWebVitals from './reportWebVitals';
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

// Removing a previously existing Service Worker, added by the original `Create React App` to allow PWA,
// because it is creating caching issues for some users. Will remove this in a few cycles, to allow propagation.
unregister();

// Create redux store
const store = configureStore();
const { clientId } = getOneConfig('clientId');

render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={clientId}>
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
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(localStorage.DEBUG && console.log);
