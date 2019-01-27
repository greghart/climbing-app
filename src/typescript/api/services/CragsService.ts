import { Path, GET, PathParam, QueryParam } from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getCrags from '../operations/getCrags';
import Crag from '../../models/Crag';

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Path('/crags')
export default class CragsService {

  @GET
  @Path('')
  @Tags('crags')
  @Response<object>(200, 'Retrieve all crag data')
  public async getCrags() {
    return getCrags();
  }

}

type CragsServiceType = typeof CragsService.prototype;
export { CragsServiceType };
