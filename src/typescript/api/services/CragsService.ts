import { getRepository } from 'typeorm';
import * as Rest from 'typescript-rest';
import { Tags, Response } from 'typescript-rest-swagger';

import Crag from '../../models/Crag';
import getCrag from '../operations/getCrag';
import updateCrag from '../operations/updateCrag';
import addArea from '../operations/addArea';
import validate from '../util/validate';
import CragCodec from '../../codecs/CragCodec';
import { AreaPayload } from './AreasService';
import AreaCodec from '../../codecs/AreaCodec';

// For swagger generation we need dead simple types
interface CragPayload {
  name: string;
  description?: string;
}

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

  @Rest.PUT
  @Rest.Path(':id')
  @Tags('crags')
  @Response<CragPayload>(200, 'Update a crag')
  public async updateCrag(
    @Rest.PathParam('id') id: string,
    data: CragPayload
  ) {
    const crag = await getCrag(id);
    const payload = await validate(data, CragCodec);
    return updateCrag(crag, payload)
  }

  @Rest.POST
  @Rest.Path(':id/areas')
  @Tags('crags')
  @Response<AreaPayload>(201, 'Add an area to a crag')
  public async addArea(
    // Areas must be added to a crag currently
    @Rest.PathParam('id') id: string,
    data: AreaPayload
  ) {
    const crag = await getRepository(Crag).findOne(id)
    const payload = await validate(data, AreaCodec);
    return addArea(
      crag,
      payload
    )
    .then((area) => {
      return new Rest.Return.NewResource(`/crags/${crag.id}`, area)
    })
  }
}

type CragsServiceType = typeof CragsService.prototype;
export { CragsServiceType };
