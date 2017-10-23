import { asyncServiceCreator, asyncDummyCreator } from './asyncFactory';

// Create all required async services here
export function createAsyncs(isDevelopment = false) {

  const apiBase = '/api';

  const asyncs = {
    application: {
      fetchApplications: asyncServiceCreator('GET', `${apiBase}/applications/`),
      fetchApplication: id => (asyncServiceCreator('GET', `${apiBase}/applications/${id}`))()
    },
    auth: {
      daco: asyncServiceCreator('GET', `${apiBase}/daco/`),
      googleSuccess: asyncServiceCreator('POST', `${apiBase}/auth/google/`, true, true),
      adminLogin: asyncServiceCreator('POST', `${apiBase}/auth/login/`, false, true),
      logout: asyncServiceCreator('POST', `${apiBase}/auth/logout/`, true, true)

    },
    profile: {
      getUser: asyncServiceCreator('GET', `${apiBase}/auth/user`),
      getSocial: asyncServiceCreator('GET', `${apiBase}/auth/social`),
      userCheck: id => (asyncServiceCreator('GET', `${apiBase}/request/user/check/${id}`))()
    },
    project: {
      fetchProjects: asyncServiceCreator('GET', `${apiBase}/projects/`),
      fetchProject: id => (asyncServiceCreator('GET', `${apiBase}/projects/${id}`))(),
      fetchProjectUsers: id => (asyncServiceCreator('GET', `${apiBase}/projects/users/${id}`))(),
      approve: asyncServiceCreator('PUT', `${apiBase}/projects/`, true, true),
      deny: asyncServiceCreator('PUT', `${apiBase}/projects/`, true, true)
    },
    userRequest: {
      dacoAccess: email => (asyncServiceCreator('GET', `${apiBase}/daco/${email}`))(),
      userRequest: asyncServiceCreator('POST', `${apiBase}/request/user/`, true, true)
    },
    user: {
      fetchUserRequests: asyncServiceCreator('GET', `${apiBase}/projects/users/`),
      approveUserRequests: asyncServiceCreator('PUT', `${apiBase}/projects/users/`, true, true),
      denyUserRequests: asyncServiceCreator('PUT', `${apiBase}/projects/users/`, true, true)
    }
  }

  // If dummy async services are required in development override here
  if (isDevelopment) {
    return {
      ...asyncs
    }
  }

  return asyncs;
}