import * as Bluebird from 'bluebird';
import { normalize } from 'normalizr';

import { BoulderSchema, RouteSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';
import Route from '../../../models/Route';
import Boulder from '../../../models/Boulder';
import { receiveEntities } from '../entities';

const fetchCommentableForRoute = (route: Route) => {
  return (dispatch) => {
    Bluebird.resolve(getSwagger().commentables.commentableForRoute(route.id.toString()))
    .then((commentable) => {
      console.log(commentable);
      route.commentable = commentable;
      return dispatch(
        receiveEntities(
          normalize(
            route,
            RouteSchema
          )
        )
      )
    })
  }
}

const fetchCommentableForBoulder = (boulder: Boulder) => {
  return (dispatch) => {
    Bluebird.resolve(getSwagger().commentables.commentableForBoulder(boulder.id.toString()))
    .then((commentable) => {
      boulder.commentable = commentable;
      return dispatch(
        receiveEntities(
          normalize(
            boulder,
            BoulderSchema
          )
        )
      )
    })
  }
}

export { fetchCommentableForBoulder, fetchCommentableForRoute };
