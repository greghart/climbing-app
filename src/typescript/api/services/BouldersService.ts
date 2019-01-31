import * as Rest from 'typescript-rest';
import { Path, GET, PathParam, QueryParam } from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getBoulder from '../operations/getBoulder';
import addRoute from '../operations/addRoute';

// Payload for route data
interface AddRoutePayload {
  name: string;
  description: string;
  gradeRaw: string;
  length?: number;
  firstAscent?: string;
}

/**
 * Climbing boulders service.
 */
@Path('/boulders')
export default class BouldersService {

  @GET
  @Path(':id')
  @Tags('boulders')
  @Response<object>(200, 'Get data on a climbing boulder')
  public async getBoulder(
    @PathParam('id') id: string,
    @QueryParam('includeComments') includeComments?: boolean
  ) {
    return getBoulder(id, { includeComments });
  }

  @Rest.POST
  @Path(':id/routes')
  @Tags('boulders')
  @Response<object>(201, 'Add a route to a boulder')
  public async addRoute(
    // Routes must be added to a boulder currently
    @PathParam('id') id: string,
    data: AddRoutePayload
  ) {
    const boulder = await getBoulder(id);
    return addRoute(
      boulder,
      data
    )
    .then((route) => {
      return new Rest.Return.NewResource(`/boulders/${boulder.id}`, route)
    })
  }

}

type BouldersServiceType = typeof BouldersService.prototype;
export { BouldersServiceType };
export { AddRoutePayload };
