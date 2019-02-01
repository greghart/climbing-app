import { getRepository } from 'typeorm';

import Boulder from '../../models/Boulder';
import Route from '../../models/Route';
import { RoutePayload } from '../services/RoutesService';

const addRoute = (boulder: Boulder, data: RoutePayload) => {
  const route = new Route();
  Object.assign(route, data);
  route.boulder = boulder;
  return getRepository(Route).save(route);
};

export default addRoute;
