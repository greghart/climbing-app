import { normalize } from 'normalizr';
import omit = require('lodash/omit');
import range = require('lodash/range');
import * as t from 'io-ts';

import { receiveEntities } from '../entities';
import { BoulderSchema } from '../../normalizr';
import validate, { types } from './util/validate';
import getSwagger from './util/getSwagger';
import Boulder from '../../../models/Boulder';

const validGrades = range(16).map((i) => `V${i}`)
const FormData = t.intersection([
  // Required
  t.type({
    name: types.minLength,
    description: types.minLength,
    length: t.refinement(types.integerFromString, (h) => h <= 29029, 'height.tallerThanEverest'),
    gradeRaw: t.refinement(
      t.string,
      (text) => validGrades.indexOf(text) > -1,
      'grade.valid'
    ),
  }),
  // Optional
  t.partial({
    firstAscent: t.string
  })
]);

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, FormData)
    .then((routeData) => {
      return 'yay';
      // return getSwagger().commentables.addComment(
      //   commentable.id.toString(),
      //   commentData
      // );
    })
    // .then((comment) => {
    //   // Receive the new comment, and add to commentable
    //   return dispatch(
    //     receiveEntities(
    //       normalize(
    //         {
    //           ...commentable,
    //           comments: [
    //             omit(comment, 'commentable'),
    //             ...commentable.comments
    //           ]
    //         },
    //         CommentableSchema,
    //       )
    //     )
    //   )
    // })
  };
};

