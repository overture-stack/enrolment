import { App, Login, Main, NotFound } from './modules';

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        component: Login,
        exact: true,
      },
      {
        path: '/login',
        component: Login,
        exact: true,
      },
      {
        component: Main,
        routes: [
          {
            path: '/dashboard',
            component: Login,
            exact: true,
          },
          {
            path: '/register/project',
            component: Login,
            exact: true,
          },
          {
            path: '/register/user',
            component: Login,
            exact: true,
          },
          {
            path: '/projects',
            component: Login,
            exact: true,
          },
        ],
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routes;
