import { asyncServiceCreator, asyncDummyCreator } from './asyncFactory';

// Create all required async services here
export function createAsyncs(isDevelopment = false) {
  const apiBase = '/api/v1';
  const billingBase = 'https://billing.cancercollaboratory.org/api';

  // Various configs used for API calls
  const withDataAndCSRF = { csrf: true, withData: true };
  const withCSRF = { csrf: true, withData: false };

  const asyncs = {
    application: {
      fetchApplications: asyncServiceCreator('GET', `${apiBase}/applications/`),
      fetchApplication: id => asyncServiceCreator('GET', `${apiBase}/applications/${id}/`)(),
      submit: asyncServiceCreator('POST', `${apiBase}/applications/`, withDataAndCSRF),
    },
    auth: {
      googleSuccess: asyncServiceCreator('POST', `${apiBase}/auth/google/`, withDataAndCSRF),
      adminLogin: data =>
        asyncServiceCreator('POST', `${apiBase}/auth/login/`, withDataAndCSRF)(
          data,
        ).catch(error => {
          if (error.response.data && error.response.data.non_field_errors)
            return Promise.reject('The Credentials Provided were not correct');

          return Promise.reject('Something went wrong. Please Try again.');
        }),
      logout: asyncServiceCreator('POST', `${apiBase}/auth/logout/`, withCSRF),
    },
    profile: {
      getUser: asyncServiceCreator('GET', `${apiBase}/auth/user/`),
      getSocial: asyncServiceCreator('GET', `${apiBase}/auth/social/`),
    },
    project: {
      fetchProjects: asyncServiceCreator('GET', `${apiBase}/projects/`),
      fetchProject: id => asyncServiceCreator('GET', `${apiBase}/projects/${id}/`)(),
      submit: asyncServiceCreator('POST', `${apiBase}/projects/`, withDataAndCSRF),
      update: (id, data) =>
        asyncServiceCreator('PATCH', `${apiBase}/projects/${id}/`, withDataAndCSRF)(data),
    },
    projectUsers: {
      fetchAll: asyncServiceCreator('GET', `${apiBase}/projects/all/users/`),
      fetchByProjectId: projectId =>
        asyncServiceCreator('GET', `${apiBase}/projects/${projectId}/users/`)(),
      fetchOneProjectUser: (projectId, id) =>
        asyncServiceCreator('GET', `${apiBase}/projects/${projectId}/users/${id}/`)(),
      create: (projectId, data) =>
        asyncServiceCreator('POST', `${apiBase}/projects/${projectId}/users/`, withDataAndCSRF)(
          data,
        ),
      update: (projectId, id, data) =>
        asyncServiceCreator(
          'PATCH',
          `${apiBase}/projects/${projectId}/users/${id}/`,
          withDataAndCSRF,
        )(data),
    },
    daco: {
      check: email =>
        asyncServiceCreator('GET', `${apiBase}/daco/${email}/`)().catch(error => {
          if (error)
            return Promise.reject(
              new Error(
                `You need a DACO account to be able to use this Application. <br/>
                For more information, Please go to <a href="https://icgc.org/daco" target="_blank">https://icgc.org/daco</a>`,
              ),
            );
        }),
    },
    billing: {
      getPrice: asyncServiceCreator('GET', `${billingBase}/price`),
    },
  };

  // If dummy async services are required in development override here
  if (isDevelopment) {
    return {
      ...asyncs,
      daco: {
        ...asyncs.daco,
        check: email =>
          asyncDummyCreator(
            {
              user: {
                openid: email,
                csa: true,
                userinfo: [
                  {
                    uid: email,
                    name: email,
                    email: email,
                  },
                ],
              },
            },
            250,
          )(),
      },
    };
  }

  return asyncs;
}
