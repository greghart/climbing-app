import { normalize, Schema } from 'normalizr';
import * as fetch from 'isomorphic-fetch';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { CommentSchema } from '../../normalizr';

// TODO Refactor this to make adding API operations a breeze
export default (options) => {
  return (dispatch) => {
    return fetch(`/api/route/${options.route.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: options.text,
        userId: 1//options.user.id
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((route) => {
      return dispatch(
        receiveEntities(
          normalize(
            route,
            CommentSchema,
          )
        )
      );
    });
  };
};
