import * as Rest from 'typescript-rest';
import { Path, GET, PathParam, QueryParam, POST } from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';
import { getRepository } from 'typeorm';

import getRoute from '../operations/getRoute';
import addCommentToRoute from '../operations/addCommentToRoute';
import User from '../../models/User';

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
    @QueryParam('includeComments') includeComments?: boolean
  ) {
    return getRoute(id, { includeComments });
  }

  @Rest.POST
  @Path(':id/comments')
  @Tags('routes')
  @Response<object>(201, 'Add a comment for a route')
  public async addComment(
    @PathParam('id') id: string,
    data: { text: string }
  ) {
    const user = await getRepository(User).findOneById(1)
    const route = await getRoute(id);
    return addCommentToRoute(
      route,
      data.text,
      user
    )
    .then((comment) => {
      return new Rest.Return.NewResource(`/routes/${route.id}`, comment)
    })
  }

}

type RoutesServiceType = typeof RoutesService.prototype;
export { RoutesServiceType };
