import * as Bluebird from 'bluebird';
import { normalize, Schema } from 'normalizr';

import { BoulderSchema, RouteSchema, AreaSchema, CragSchema } from '../../normalizr';
import getSwagger, { SwaggerAPI } from './util/getSwagger';
import Commentable from '../../../models/Commentable';
import { receiveEntities } from '../entities';

type CommentableFetchers = 'commentableForCrag' | 'commentableForArea' | 'commentableForBoulder' | 'commentableForRoute';
const getFetchCommentable = (schema: Schema, api: CommentableFetchers) => {
  return (entity: { id: string | number, commentable?: Commentable }) => {
    return (dispatch) => {
      Bluebird.resolve(getSwagger().commentables[api](entity.id.toString()))
      .then((commentable) => {
        entity.commentable = commentable;
        return dispatch(
          receiveEntities(
            normalize(
              entity,
              schema
            )
          )
        )
      })
    }
  }
};

const fetchCommentableForCrag = getFetchCommentable(CragSchema, 'commentableForCrag');
const fetchCommentableForArea = getFetchCommentable(AreaSchema, 'commentableForArea');
const fetchCommentableForBoulder = getFetchCommentable(BoulderSchema, 'commentableForBoulder');
const fetchCommentableForRoute = getFetchCommentable(RouteSchema, 'commentableForRoute');

export {
  fetchCommentableForCrag,
  fetchCommentableForArea,
  fetchCommentableForBoulder,
  fetchCommentableForRoute
};
