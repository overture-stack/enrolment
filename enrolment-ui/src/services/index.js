import { createAsyncs } from './async';

const isDev = process.env.NODE_ENV && process.env.NODE_ENV === 'development';
const asyncServices = createAsyncs(isDev);

export default asyncServices;
