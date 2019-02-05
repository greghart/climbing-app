import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import { AreaSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Area from '../../../models/Area';
import AreaCodec from '../../../codecs/AreaCodec';

export default (area: Area, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, AreaCodec)
    .then((areaData) => {
      return getSwagger().areas.updateArea(
        area.id.toString(),
        areaData
      );
    })
    .then((area) => {
      // Receive the updated area
      return dispatch(
        receiveEntities(
          normalize(
            area,
            AreaSchema
          )
        )
      )
    })
  };
};


