import { getRepository } from 'typeorm';
import { Omit } from 'utility-types';

import Boulder from '../../models/Boulder';
import Route from '../../models/Route';
import { AddRoutePayload } from '../services/BouldersService';

const addRoute = (boulder: Boulder, data: AddRoutePayload) => {
  const route = new Route();
  Object.assign(route, data);
  route.boulder = boulder;
  return getRepository(Route).save(route);
};

export default addRoute;
