import * as Rest from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getCrag from '../operations/getCrag';
import Crag from '../../models/Crag';

/**
 * Climbing routes controller.
 * Note the semantic distinction between a climbing route and a server route!
 */
@Rest.Path('/crags')
export default class CragsService {

  @Rest.GET
  @Tags('crags')
  @Rest.Path(':id')
  @Response<object>(200, 'Retrieve crag data')
  public async getCrag(
    @Rest.PathParam('id') id: string
  ) {
    return getCrag(id);
  }

}

type CragsServiceType = typeof CragsService.prototype;
export { CragsServiceType };
