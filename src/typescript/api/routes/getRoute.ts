import { Operation } from '../action';
import getConnection from '../../db';
import Route, { Client } from '../../models/Route';
import omit = require('lodash/omit');

const getRoute: Operation<[string, { includeComments: boolean }], Client> = ([id, { includeComments }]) => {
  const relations = ['boulder', 'boulder.area', 'boulder.area.crag'];
  console.log({ includeComments });
  if (includeComments) {
    relations.push('commentable');
    relations.push('commentable.comments');
    relations.push('commentable.comments.user');
  }
  return getConnection()
  .then(async (connection) => {
    const routeRepository = connection.getRepository(Route);
    return await routeRepository.findOneById(id, { relations });
  })
  // TODO How should we handle lazy properties being sent to the client when they're eagerly loaded?
  .then(async (route) => {
    return {
      ...omit(route, '__commentable__', '__has_commentable__'),
      commentable: (route as any).__commentable__
    } as Client;
  })
};

export default getRoute;
