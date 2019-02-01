import { getRepository } from 'typeorm';
import * as Rest from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import getArea from '../operations/getArea';
import addBoulder from '../operations/addBoulder';
import { BoulderPayload } from './BouldersService';
import Area from '../../models/Area';

// Payload for area data
interface AreaPayload {
  name: string;
  description?: string;
}

/**
 * Climbing areas service.
 */
@Rest.Path('/areas')
export default class AreasService {

  @Rest.GET
  @Rest.Path(':id')
  @Tags('areas')
  @Response<object>(200, 'Get data on a climbing area')
  public async getArea(
    @Rest.PathParam('id') id: string,
    @Rest.QueryParam('includeComments') includeComments?: boolean
  ) {
    return getArea(id, { includeComments });
  }

  @Rest.POST
  @Rest.Path(':id/boulders')
  @Tags('areas')
  @Response<BoulderPayload>(201, 'Add a boulder to an area')
  public async addBoulder(
    // Boulders must be added to an area currently
    @Rest.PathParam('id') id: string,
    data: BoulderPayload
  ) {
    const area = await getArea(id);
    return addBoulder(
      area,
      data
    )
    .then((boulder) => {
      return new Rest.Return.NewResource(`/areas/${area.id}`, boulder)
    })
  }

  @Rest.PUT
  @Rest.Path(':id')
  @Tags('areas')
  @Response<AreaPayload>(200, 'Update a area')
  public async updateArea(
    @Rest.PathParam('id') id: string,
    data: AreaPayload
  ) {
    const area = await getArea(id);
    Object.assign(area, data);
    return getRepository(Area).save(area);
  }

}

type AreasServiceType = typeof AreasService.prototype;
export { AreasServiceType };

