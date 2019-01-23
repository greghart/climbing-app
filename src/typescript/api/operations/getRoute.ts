import omit = require('lodash/omit');
import { Operation } from '../action';
import getConnection from '../../db';
import Route from '../../models/Route';

const getRoute: Operation<[string, { includeComments: boolean }], Route> = ([id, { includeComments }]) => {
  const relations = ['boulder', 'boulder.area', 'boulder.area.crag'];
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
  .then((route) => {
    // Signal client that we've not found comments
    if (includeComments && route.commentable === undefined) {
      route.commentable = null;
    }
    return route;
  });
};

export default getRoute;
