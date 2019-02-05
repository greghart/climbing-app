import * as Rest from 'typescript-rest';
import * as t from 'io-ts';
import { Tags, Response } from 'typescript-rest-swagger';

import getArea from '../operations/getArea';
import getAreas from '../operations/getAreas';
import addBoulder from '../operations/addBoulder';
import { BoulderPayload } from './BouldersService';
import updateArea from '../operations/updateArea';
import validate from '../util/validate';
import AreaCodec from '../../codecs/AreaCodec';

// For swagger generation we need dead simple types
interface AreaPayload {
  name: string;
  description?: string;
  coordinates: Array<{ lat: number, lng: number, order: number }>;
}

/**
 * Climbing areas service.
 */
@Rest.Path('/areas')
export default class AreasService {

  /**
   *
   * @param ids A CSV of ids to request
   * @param includeComments Whether to include comments for each area
   */
  @Rest.GET
  @Rest.Path(':ids')
  @Tags('areas')
  @Response<AreaPayload[]>(200, 'Get data on a climbing area or areas')
  public async getAreas(
    @Rest.PathParam('ids') ids: string,
    @Rest.QueryParam('includeComments') includeComments?: boolean
  ) {
    return getAreas(ids.split(','), { includeComments });
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
    const payload = await validate(data, AreaCodec);
    return updateArea(area, payload)
  }

}

type AreasServiceType = typeof AreasService.prototype;
export { AreasServiceType };
