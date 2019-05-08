import APIClientInterface from './APIClientInterface';

// This is a no-op that we will replace with webpack properly.
// The logic is as below, but we want to avoid bundling `getServiceClient`
// for the browser
// const getter: APIClientInterface = process.env.IS_SERVER === 'true' ?
  // require('./getSwaggerClient') :
  // require('./getServiceClient');
const noop = undefined as unknown as () => APIClientInterface;

export default noop;
