import { App, Login, NotFound } from './modules';

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        component: Login,
      },
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/dashboard',
        component: Login,
      },
      {
        path: '/register/project',
        component: Login,
      },
      {
        path: '/register/user',
        component: Login,
      },
      {
        path: '/projects',
        component: Login,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routes;
