import * as Bluebird from 'bluebird';
import { normalize } from 'normalizr';

import { BoulderSchema, RouteSchema, AreaSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';
import { receiveEntities } from '../entities';

const fetchCommentableForArea = (area: Area) => {
  return (dispatch) => {
    Bluebird.resolve(getSwagger().commentables.commentableForArea(area.id.toString()))
    .then((commentable) => {
      area.commentable = commentable;
      return dispatch(
        receiveEntities(
          normalize(
            area,
            AreaSchema
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

export { fetchCommentableForArea, fetchCommentableForBoulder, fetchCommentableForRoute };
