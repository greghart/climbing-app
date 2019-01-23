import { Path, GET, PathParam, QueryParam } from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getRoute from '../operations/getRoute';
import Route from '../../models/Route';
import { Omit } from 'utility-types';

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Path('/routes')
export default class RoutesService {

  @GET
  @Path(':id')
  @Tags('routes')
  @Response<object>(200, 'Get data on a climbing route')
  public async getRoute(
    @PathParam('id') id: string,
    @QueryParam('includeComments') includeComments: boolean
  ): Promise<{}> {
    return getRoute([id, { includeComments }]);
  }

}
