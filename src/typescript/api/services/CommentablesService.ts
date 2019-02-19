import * as Rest from 'typescript-rest';
import * as Swagger from 'typescript-rest-swagger';
import { getRepository, getCustomRepository } from 'typeorm';

import addCommentToCommentable from '../operations/addCommentToCommentable';
import User from '../../models/User';
import Commentable from '../../models/Commentable';
import CommentRepository from '../../models/repositories/CommentRepository';
import getRoute from '../operations/getRoute';
import getBoulder from '../operations/getBoulder';
import getArea from '../operations/getArea';
import Crag from '../../models/Crag';

const getComments = (id: string | number) => {
  return getRepository(Commentable).findOne(id, {
    relations: ['comments', 'comments.user'],
  });
};

/**
 * Commentables service
 */
@Rest.Path('/commentables')
export default class CommentablesService {

  @Rest.GET
  @Rest.Path(':id')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(200, 'Get data a commentable')
  public async getCommentable(
    @Rest.PathParam('id') id: string,
  ) {
    return getComments(id);
  }

  // We allow clients to get data directly from an "entity" route as it were
  @Rest.GET
  @Rest.Path('/routes/:id')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(302, 'Get the commentable for a route')
  public async commentableForRoute(
    @Rest.PathParam('id') id: string,
  ) {
    return getRoute(id)
    .then((route) => {
      return getCustomRepository(CommentRepository).findOrGetCommentable(route);
    })
    .then((commentable) => {
      return getComments(commentable.id);
    });
  }

  @Rest.GET
  @Rest.Path('/boulder/:id')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(302, 'Get the commentable for a boulder')
  public async commentableForBoulder(
    @Rest.PathParam('id') id: string,
  ) {
    return getBoulder(id)
    .then((boulder) => {
      return getCustomRepository(CommentRepository).findOrGetCommentable(boulder);
    })
    .then((commentable) => {
      return getComments(commentable.id);
    });
  }

  @Rest.GET
  @Rest.Path('/area/:id')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(302, 'Get the commentable for a area')
  public async commentableForArea(
    @Rest.PathParam('id') id: string,
  ) {
    return getArea(id)
    .then((area) => {
      return getCustomRepository(CommentRepository).findOrGetCommentable(area);
    })
    .then((commentable) => {
      return getComments(commentable.id);
    });
  }

  @Rest.GET
  @Rest.Path('/crag/:id')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(302, 'Get the commentable for a crag')
  public async commentableForCrag(
    @Rest.PathParam('id') id: string,
  ) {
    return getRepository(Crag).findOne(id)
    .then((crag) => {
      return getCustomRepository(CommentRepository).findOrGetCommentable(crag);
    })
    .then((commentable) => {
      return getComments(commentable.id);
    });
  }

  @Rest.POST
  @Rest.Path(':id/comments')
  @Swagger.Tags('commentables')
  @Swagger.Response<object>(201, 'Add a comment for a commentable')
  public async addComment(
    @Rest.PathParam('id') id: string,
    data: { text: string },
  ) {
    const user = await getRepository(User).findOne(1);
    const commentable = await getRepository(Commentable).findOne(id);
    return addCommentToCommentable(
      commentable,
      data.text,
      user,
    )
    .then((comment) => {
      return new Rest.Return.NewResource(`/commentables/${commentable.id}`, comment);
    });
  }

}

type CommentablesServiceType = typeof CommentablesService.prototype;
export { CommentablesServiceType };
