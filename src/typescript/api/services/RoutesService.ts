import { Path, GET, PathParam, QueryParam } from 'typescript-rest';

import RouteModel from '../../models/Route';
import getRoute from '../operations/getRoute';

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Path('/routes')
export default class RoutesService {

  @GET
  @Path('/:id')
  public async getRoute(
    @PathParam('id') id: string,
    @QueryParam('includeComments') includeComments: boolean
  ): Promise<RouteModel> {
    return getRoute([id, { includeComments }]);
  }

}
