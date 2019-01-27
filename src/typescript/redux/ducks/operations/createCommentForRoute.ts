import { normalize } from 'normalizr';
import { replace } from 'connected-react-router';
import omit = require('lodash/omit');
import * as t from 'io-ts';

import { receiveEntities } from '../entities';
import { CommentableSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import fetchRoute from './fetchRoute';

/**
 * Run-time boundary validation:
 * 1. Happens from form input, where we don't know if the user input valid data
 * 2. Happens from API response, where we don't know what server responded with.
 * 3. Happens on server from client request, where we don't know what client sent.
 *
 * #2 and #3 should be handled by swagger layer.
 * #1 we will handle with `io-ts`
 **/

const FormData = t.type({
  text: t.refinement(t.string, text => text.length > 2, 'text.minLength')
})

// TODO Refactor this to make adding API operations a breeze
export default (options) => {
  return (dispatch) => {
    return validate({ text: options.text }, FormData)
    .then((commentData) => {
      return getSwagger().routes.addComment(
        options.route.id,
        commentData
      );
    })
    .then((comment) => {
      // Receive the new comment, and add to commentable
      /**
       * @todo A better way to handle different sides of relationships?
       * Currently we have to invert to make sure the commentable gets the new comment
       * That means some spreads, an omit, etc.
       */
      if (options.route.commentable) {
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...comment.commentable,
                comments: [
                  omit(comment, 'commentable'),
                  ...options.route.commentable.comments
                ]
              },
              CommentableSchema,
            )
          )
        )
      } else {
        return dispatch(
          fetchRoute('reload-fetch')(options.route.id, true)
        )
      }
    })
    .then(() => {
      return dispatch(
        replace(`/route/${options.route.id}/comments`)
      );
    });
  };
};
