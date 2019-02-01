import { getRepository } from 'typeorm';
import * as Rest from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getRoute from '../operations/getRoute';
import Route from '../../models/Route';

// Payload for route data
interface RoutePayload {
  name: string;
  description: string;
  gradeRaw: string;
  length?: number;
  firstAscent?: string;
}

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Rest.Path('/routes')
export default class RoutesService {

  @Rest.GET
  @Rest.Path(':id')
  @Tags('routes')
  @Response<RoutePayload>(200, 'Get data on a climbing route')
  public async getRoute(
    @Rest.PathParam('id') id: string,
    @Rest.QueryParam('includeComments') includeComments?: boolean
  ) {
    return getRoute(id, { includeComments });
  }

  @Rest.PUT
  @Rest.Path(':id')
  @Tags('routes')
  @Response<RoutePayload>(200, 'Update a route')
  public async updateRoute(
    @Rest.PathParam('id') id: string,
    data: RoutePayload
  ) {
    const route = await getRoute(id);
    Object.assign(route, data);
    return getRepository(Route).save(route);
  }

}

type RoutesServiceType = typeof RoutesService.prototype;
export { RoutesServiceType };
export { RoutePayload };
