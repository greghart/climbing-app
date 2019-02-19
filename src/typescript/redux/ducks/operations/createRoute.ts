import { normalize } from 'normalizr';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { BoulderSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Boulder from '../../../models/Boulder';
import RouteCodec from '../../../codecs/RouteCodec';

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, RouteCodec)
    .then((routeData) => {
      return getSwagger().boulders.addRoute(
        boulder.id.toString(),
        routeData,
      );
    })
    .then((route) => {
      // Receive the new route, and add to boulder
      return dispatch(
        receiveEntities(
          normalize(
            {
              ...boulder,
              routes: [
                omit(route, 'boulder'),
                ...boulder.routes,
              ],
            },
            BoulderSchema,
          ),
        ),
      );
    });
  };
};
