import { normalize } from 'normalizr';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { CragSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Crag from '../../../models/Crag';
import AreaCodec from '../../../codecs/AreaCodec';

export default (crag: Crag, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(data, 'createArea');
    return validate(data, AreaCodec)
    .then((areaData) => {
      return getSwagger().crags.addArea(
        crag.id.toString(),
        areaData,
      );
    })
    .then((area) => {
      // Receive the new area, and add to crag
      return dispatch(
        receiveEntities(
          normalize(
            {
              ...crag,
              areas: [
                omit(area, 'crag'),
                ...crag.areas,
              ],
            },
            CragSchema,
          ),
        ),
      );
    });
  };
};
