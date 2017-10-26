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
            component: Dashboard,
            exact: true,
          },
          {
            path: '/register/project',
            component: RegisterProject,
            exact: true,
          },
          {
            path: '/register/user',
            component: RegisterUser,
            exact: true,
          },
          {
            path: '/projects',
            component: Projects,
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
