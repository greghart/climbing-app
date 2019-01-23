import { Path, GET, PathParam, QueryParam } from 'typescript-rest';

import CragModel from '../../models/Crag';
import getCrags from '../operations/getCrags';

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Path('/crags')
export default class CragsService {

  @GET
  @Path('')
  public async getCrags() {
    return getCrags();
  }

}

