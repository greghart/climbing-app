import { Operation } from '../action';
import getConnection from '../../db';
import Crag from '../../models/Crag';
// import RouteConfiguration from './RouteConfiguration';
// import getOrgClient from '../../util/getOrgClient';

const getCrags: Operation<void, Crag[]> = () => {
  return getConnection()
  .then(async (connection) => {
    const cragRepository = connection.getRepository(Crag);
    return await cragRepository.find({
      relations: ['areas', 'areas.boulders', 'areas.coordinates']
    });
  });
};

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

export default getCrags;
