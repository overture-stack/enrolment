import { asyncServiceCreator } from './asyncFactory';

// Create all required async services here
export function createAsyncs(isDevelopment = false) {
  const apiBase = '/api';

  // Various configs used for API calls
  const withData = { csrf: false, withData: true };
  const withDataAndCSRF = { csrf: true, withData: true };

  const asyncs = {
    application: {
      fetchApplications: asyncServiceCreator('GET', `${apiBase}/applications/`),
      fetchApplication: id => asyncServiceCreator('GET', `${apiBase}/applications/${id}`)(),
    },
    auth: {
      daco: asyncServiceCreator('GET', `${apiBase}/daco/`),
      googleSuccess: asyncServiceCreator('POST', `${apiBase}/auth/google/`, withDataAndCSRF),
      adminLogin: asyncServiceCreator('POST', `${apiBase}/auth/login/`, withData),
      logout: asyncServiceCreator('POST', `${apiBase}/auth/logout/`, withDataAndCSRF),
    },
    profile: {
      getUser: asyncServiceCreator('GET', `${apiBase}/auth/user`),
      getSocial: asyncServiceCreator('GET', `${apiBase}/auth/social`),
      userCheck: id => asyncServiceCreator('GET', `${apiBase}/request/user/check/${id}`)(),
    },
    project: {
      fetchProjects: asyncServiceCreator('GET', `${apiBase}/projects/`),
      fetchProject: id => asyncServiceCreator('GET', `${apiBase}/projects/${id}`)(),
      fetchProjectUsers: id => asyncServiceCreator('GET', `${apiBase}/projects/users/${id}`)(),
      approve: asyncServiceCreator('PUT', `${apiBase}/projects/`, withDataAndCSRF),
      deny: asyncServiceCreator('PUT', `${apiBase}/projects/`, withDataAndCSRF),
    },
    user: {
      dacoAccess: email => asyncServiceCreator('GET', `${apiBase}/daco/${email}`)(),
      userRequest: asyncServiceCreator('POST', `${apiBase}/request/user/`, withDataAndCSRF),
      fetchUserRequests: asyncServiceCreator('GET', `${apiBase}/projects/users/`),
      approveUserRequests: asyncServiceCreator(
        'PUT',
        `${apiBase}/projects/users/`,
        withDataAndCSRF,
      ),
      denyUserRequests: asyncServiceCreator('PUT', `${apiBase}/projects/users/`, withDataAndCSRF),
    },
  };

  // If dummy async services are required in development override here
  if (isDevelopment) {
    return {
      ...asyncs,
    };
  }

  return asyncs;
}
