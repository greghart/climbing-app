import { normalize } from 'normalizr';
import * as fetch from 'isomorphic-fetch';
import { push } from 'connected-react-router';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { CommentSchema, CommentableSchema } from '../../normalizr';

// TODO Refactor this to make adding API operations a breeze
export default (options) => {
  return (dispatch) => {
    return fetch(`/api/routes/${options.route.id}/comments`, {
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
    .then((comment) => {
      // Receive the new comment, and add to commentable
      /**
       * @todo Decide a consistent scalable way to handle data merging
       * Here, we want to go back to the comments page.
       * However, it could be that existing comments are already loaded, we don't know.
       * We can split on this logic, or just reload every time.
       * This decision also affects above how we receive the incoming entity
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
      }
    })
    .then(() => {
      return dispatch(
        push(`/route/${options.route.id}/comments`)
      );
    });
  };
};
