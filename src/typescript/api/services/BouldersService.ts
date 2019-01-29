import * as Rest from 'typescript-rest';
import { Path, GET, PathParam, QueryParam, POST } from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';
import { getRepository } from 'typeorm';

import getBoulder from '../operations/getBoulder';
import addCommentToBoulder from '../operations/addCommentToBoulder';
import User from '../../models/User';

/**
 * Climbing boulders controller.
 * Note the semantic distinction between a climbing boulder and a server boulder!
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
  @Path(':id/comments')
  @Tags('boulders')
  @Response<object>(201, 'Add a comment for a boulder')
  public async addComment(
    @PathParam('id') id: string,
    data: { text: string }
  ) {
    const user = await getRepository(User).findOneById(1)
    const boulder = await getBoulder(id);
    return addCommentToBoulder(
      boulder,
      data.text,
      user
    )
    .then((comment) => {
      return new Rest.Return.NewResource(`/boulders/${boulder.id}`, comment)
    })
  }

}

type BouldersServiceType = typeof BouldersService.prototype;
export { BouldersServiceType };

