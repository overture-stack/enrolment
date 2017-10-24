import { createAsyncs } from './async';

const asyncServices = createAsyncs();

asyncServices.application.fetchApplications();
asyncServices.application.fetchApplication(1);

// asyncServices.project.fetchProjectUsers(2);
// asyncServices.project.approve();
// asyncServices.project.deny();
