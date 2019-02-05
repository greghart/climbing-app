import { normalize } from 'normalizr';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { RouteSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Route from '../../../models/Route';
import RouteCodec from '../../../codecs/RouteCodec';

export default (route: Route, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(route, data, 'updateRoute');
    return validate(data, RouteCodec)
    .then((routeData) => {
      return getSwagger().routes.updateRoute(
        route.id.toString(),
        routeData
      );
    })
    .then((route) => {
      // Receive the updated route
      return dispatch(
        receiveEntities(
          normalize(
            route,
            RouteSchema
          )
        )
      )
    })
  };
};
