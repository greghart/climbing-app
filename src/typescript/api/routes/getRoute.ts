import { Operation } from '../action';
import getConnection from '../../db';
import Route from '../../models/Route';

const getRoute: Operation<string, Route> = (id) => {
  return getConnection()
  .then(async (connection) => {
    const routeRepository = connection.getRepository(Route);
    return await routeRepository.findOneById(id, {
      relations: ['boulder', 'boulder.area', 'boulder.area.crag']
    });
  });
};

export default getRoute;
