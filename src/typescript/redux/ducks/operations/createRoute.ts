import { normalize } from 'normalizr';
import omit = require('lodash/omit');
import range = require('lodash/range');
import * as t from 'io-ts';

import { receiveEntities } from '../entities';
import { BoulderSchema } from '../../normalizr';
import validate from './util/validate';
import * as types from './util/types';
import getSwagger from './util/getSwagger';
import Boulder from '../../../models/Boulder';

const validGrades = range(16).map((i) => `V${i}`)
const FormData = t.type({
  name: types.minLength,
  description: types.minLength,
  gradeRaw: t.refinement(
    t.string,
    (text) => validGrades.indexOf(text) > -1,
    'grade.valid'
  ),
  // Optional
  length: t.union([
    t.undefined,
    t.refinement(types.integerFromString, (h) => h <= 29029, 'length.tallerThanEverest'),
  ]),
  firstAscent: t.union([
    t.undefined,
    types.minLength
  ])
});

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, FormData)
    .then((routeData) => {
      return getSwagger().boulders.addRoute(
        boulder.id.toString(),
        routeData
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
                ...boulder.routes
              ]
            },
            BoulderSchema,
          )
        )
      )
    })
  };
};

