import { Operation } from '../action';
import getConnection from '../../db';
// import RouteConfiguration from './RouteConfiguration';
// import getOrgClient from '../../util/getOrgClient';

const getCrags: Operation<void> = (req) => {
  return getConnection()
  .then((connection) => {
    return [];
  })
}

// /**
//  * Load all business regions
//  */
// const getBusinessRegions: Operation<void> = (req) => {
//   return getOrgClient()
//   .then((orgClient) => {
//     return (orgClient.business_region.getBusinessRegions as APIOperation)();
//   });
// };

// const route: RouteConfiguration = {
//   method: 'get',
//   path: '/business_regions',
//   apiDoc: yaml(`
//     summary: Get business regions
//     operationId: getBusinessRegions
//     tags:
//       - business_region
//     responses:
//       200:
//         description: List of business regions
//         schema:
//           type: array
//   `),
//   handler: {
//     operation: getBusinessRegions,
//     getArgs: () => { return; }
//   }
// };

// export default route;
